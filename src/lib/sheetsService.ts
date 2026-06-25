import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DiaryEntry, ScrapbookElement } from '../types';

// Initialize Firebase with protection against empty values in placeholder
const hasRealConfig = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "";
const app = initializeApp(hasRealConfig ? firebaseConfig : {
  apiKey: "placeholder-api-key",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder-project",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:0000:web:0000"
});

export const isFirebaseConfigured = hasRealConfig;
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Google Sheets read-only scope
provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Load cached token from session storage for convenience across refresh
try {
  cachedAccessToken = sessionStorage.getItem('g_sheets_token');
} catch (e) {}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      try { sessionStorage.removeItem('g_sheets_token'); } catch (e) {}
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (!hasRealConfig) {
    throw new Error('Configuración de Firebase incompleta en este entorno. Por favor, usa la opción de "Token de Acceso Manual" que se encuentra debajo para sincronizar tu Google Sheet directamente.');
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se recibió un token de acceso de Google.');
    }

    cachedAccessToken = credential.accessToken;
    try { sessionStorage.setItem('g_sheets_token', cachedAccessToken); } catch (e) {}
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  try { sessionStorage.removeItem('g_sheets_token'); } catch (e) {}
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Helper to normalize strings for comparison
const normalizeKey = (str: string) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Robust custom CSV parser to support public sheet exporting
export const parseCSV = (csvText: string): string[][] => {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell);
        cell = '';
      } else if (char === '\n' || char === '\r') {
        row.push(cell);
        cell = '';
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n after \r
        }
      } else {
        cell += char;
      }
    }
  }
  // Add the last cell/row if any
  if (cell !== '' || inQuotes) {
    row.push(cell);
  }
  if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
    lines.push(row);
  }
  return lines;
};

// Maps raw rows from Folder & Elements tabs to DiaryEntry structures
export const parseRowsToDiaryEntries = (folderRows: string[][], elementRows: string[][]): DiaryEntry[] => {
  if (folderRows.length < 2) {
    throw new Error(`La pestaña de Carpetas está vacía o no tiene cabeceras.`);
  }

  // Parse Folder Headers
  const folderHeaders = folderRows[0].map(h => normalizeKey(h));
  const folderDataRows = folderRows.slice(1);

  const getColIndex = (headers: string[], options: string[]) => {
    return headers.findIndex(h => options.some(opt => normalizeKey(opt) === h));
  };

  const fIdx = {
    id: getColIndex(folderHeaders, ['id', 'identificador', 'key']),
    title: getColIndex(folderHeaders, ['title', 'titulo', 'título', 'name', 'nombre']),
    subtitle: getColIndex(folderHeaders, ['subtitle', 'subtitulo', 'subtítulo', 'description', 'descripcion', 'descripción']),
    date: getColIndex(folderHeaders, ['date', 'fecha', 'time']),
    folderName: getColIndex(folderHeaders, ['foldername', 'nombrecarpeta', 'nombredecarta', 'tab', 'pestaña', 'pestana']),
    folderTabColor: getColIndex(folderHeaders, ['foldertabcolor', 'colorpestana', 'colorpestaña', 'tabcolor', 'pestañacolor']),
    folderBgColor: getColIndex(folderHeaders, ['folderbgcolor', 'colorfondo', 'bgcolor', 'fondocolor']),
    folderTextColor: getColIndex(folderHeaders, ['foldertextcolor', 'colortexto', 'textcolor', 'textocolor'])
  };

  const parsedEntries: DiaryEntry[] = folderDataRows.map((row, idx) => {
    const id = fIdx.id !== -1 && row[fIdx.id] ? row[fIdx.id].trim() : `project-${idx}`;
    const title = fIdx.title !== -1 && row[fIdx.title] ? row[fIdx.title].trim() : 'Sin título';
    const subtitle = fIdx.subtitle !== -1 && row[fIdx.subtitle] ? row[fIdx.subtitle].trim() : '';
    const date = fIdx.date !== -1 && row[fIdx.date] ? row[fIdx.date].trim() : new Date().toLocaleDateString();
    const folderName = fIdx.folderName !== -1 && row[fIdx.folderName] ? row[fIdx.folderName].trim().toUpperCase() : 'CARPETA';
    const folderTabColor = fIdx.folderTabColor !== -1 && row[fIdx.folderTabColor] ? row[fIdx.folderTabColor].trim() : 'bg-[#dfbebe] dark:bg-[#6c4848]';
    const folderBgColor = fIdx.folderBgColor !== -1 && row[fIdx.folderBgColor] ? row[fIdx.folderBgColor].trim() : 'bg-[#fcf5f5] dark:bg-[#1e1414]';
    const folderTextColor = fIdx.folderTextColor !== -1 && row[fIdx.folderTextColor] ? row[fIdx.folderTextColor].trim() : 'text-[#824d4d] dark:text-[#f2cccc]';

    return {
      id,
      title,
      subtitle,
      date,
      folderName,
      folderTabColor,
      folderBgColor,
      folderTextColor,
      elements: []
    };
  });

  // Parse Element Headers
  if (elementRows.length >= 2) {
    const elementHeaders = elementRows[0].map(h => normalizeKey(h));
    const elementDataRows = elementRows.slice(1);

    const eIdx = {
      folderId: getColIndex(elementHeaders, ['folderid', 'idcarpeta', 'idproyecto', 'parentid', 'proyecto', 'carpeta']),
      id: getColIndex(elementHeaders, ['id', 'elementid', 'identificador']),
      type: getColIndex(elementHeaders, ['type', 'tipo', 'category', 'categoria']),
      content: getColIndex(elementHeaders, ['content', 'contenido', 'text', 'texto', 'url', 'image', 'imagen']),
      title: getColIndex(elementHeaders, ['title', 'titulo', 'título', 'label', 'etiqueta']),
      rotation: getColIndex(elementHeaders, ['rotation', 'rotacion', 'rotación', 'angle', 'angulo']),
      aspectRatio: getColIndex(elementHeaders, ['aspectratio', 'proporcion', 'proporción', 'ratio']),
      extraClass: getColIndex(elementHeaders, ['extraclass', 'claseextra', 'size', 'tamano', 'tamaño', 'class'])
    };

    elementDataRows.forEach((row, idx) => {
      const folderId = eIdx.folderId !== -1 && row[eIdx.folderId] ? row[eIdx.folderId].trim() : '';
      if (!folderId) return; // Must have parent relation

      const entry = parsedEntries.find(e => e.id === folderId);
      if (!entry) return;

      const id = eIdx.id !== -1 && row[eIdx.id] ? row[eIdx.id].trim() : `element-${folderId}-${idx}`;
      
      // Parse element type
      let type: ScrapbookElement['type'] = 'text';
      const rawType = eIdx.type !== -1 && row[eIdx.type] ? row[eIdx.type].trim().toLowerCase() : 'text';
      if (['photo', 'foto', 'image', 'imagen'].includes(rawType)) type = 'photo';
      else if (['handwritten', 'manuscrito', 'carta', 'nota_mano'].includes(rawType)) type = 'handwritten';
      else if (['postit', 'nota', 'sticker'].includes(rawType)) type = 'postit';
      else if (['tape', 'cinta', 'washi'].includes(rawType)) type = 'tape';
      else if (['flower', 'flor', 'decoracion', 'decoration'].includes(rawType)) type = 'flower';
      else if (['stamp', 'estampa', 'sello'].includes(rawType)) type = 'stamp';
      else if (['paperclip', 'clip'].includes(rawType)) type = 'paperclip';
      else if (['filmstrip', 'carrete', 'film'].includes(rawType)) type = 'filmstrip';

      const content = eIdx.content !== -1 && row[eIdx.content] ? row[eIdx.content].trim() : '';
      const title = eIdx.title !== -1 && row[eIdx.title] ? row[eIdx.title].trim() : '';
      
      let rotation = 0;
      if (eIdx.rotation !== -1 && row[eIdx.rotation]) {
        const val = parseFloat(row[eIdx.rotation]);
        if (!isNaN(val)) rotation = val;
      }

      const aspectRatio = eIdx.aspectRatio !== -1 && row[eIdx.aspectRatio] ? row[eIdx.aspectRatio].trim() : 'aspect-square';
      const extraClass = eIdx.extraClass !== -1 && row[eIdx.extraClass] ? row[eIdx.extraClass].trim() : '';

      entry.elements.push({
        id,
        type,
        content,
        title,
        rotation,
        aspectRatio,
        extraClass
      });
    });
  }

  return parsedEntries;
};

// Fetch and parse sheets without OAuth tokens (using exported public CSV)
export const fetchDiaryFromPublicSheets = async (spreadsheetId: string): Promise<DiaryEntry[]> => {
  if (!spreadsheetId) throw new Error('Se requiere un ID de Google Sheets.');

  // Try common names for Folders
  const folderNames = ['Carpetas', 'Folders', 'Hoja1', 'Sheet1'];
  let folderRows: string[][] = [];
  let usedFolderTabName = '';

  for (const name of folderNames) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        if (rows.length >= 2) {
          folderRows = rows;
          usedFolderTabName = name;
          break;
        }
      }
    } catch (e) {
      console.warn(`Error al descargar pestaña ${name}:`, e);
    }
  }

  if (folderRows.length === 0) {
    throw new Error('No se pudo encontrar una pestaña de Carpetas (o Carpetas, Folders, Hoja1, Sheet1) válida. Asegúrate de que el documento esté compartido como "Cualquier persona con el enlace puede ver".');
  }

  // Try common names for Elements
  const elementNames = ['Elementos', 'Elements', 'Hoja2', 'Sheet2', 'Detalles', 'Details'];
  let elementRows: string[][] = [];
  for (const name of elementNames) {
    if (name === usedFolderTabName) continue;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const rows = parseCSV(text);
        if (rows.length >= 2) {
          elementRows = rows;
          break;
        }
      }
    } catch (e) {
      console.warn(`Error al descargar pestaña de elementos ${name}:`, e);
    }
  }

  return parseRowsToDiaryEntries(folderRows, elementRows);
};

// Map spreadsheet rows to DiaryEntry objects (Supports OAuth, manualToken, or Public mode)
export const fetchDiaryFromSheets = async (spreadsheetId: string, accessToken?: string | null): Promise<DiaryEntry[]> => {
  if (!spreadsheetId) throw new Error('Se requiere un ID de Google Sheets.');

  // If no accessToken is provided, or the token is set to 'public', fetch via public CSV directly!
  if (!accessToken || accessToken === 'public') {
    return fetchDiaryFromPublicSheets(spreadsheetId);
  }

  // 1. Fetch spreadsheet metadata to detect sheet/tab names
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`;
  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!metaRes.ok) {
    const errorData = await metaRes.json().catch(() => ({}));
    const message = errorData?.error?.message || `Error ${metaRes.status}`;
    throw new Error(`Error al leer el archivo: ${message}. Si es una hoja pública, borra el token de acceso manual o inicia sesión.`);
  }

  const metaData = await metaRes.json();
  const sheets: any[] = metaData.sheets || [];
  
  // Find folders sheet (Carpetas / Folders / Sheet1)
  const folderSheetProp = sheets.find(s => {
    const title = s.properties.title.toLowerCase();
    return title.includes('carpeta') || title.includes('folder') || title.includes('proyecto') || title.includes('project');
  }) || sheets[0];

  // Find elements sheet (Elementos / Elements / Detail / Sheet2)
  const elementSheetProp = sheets.find(s => {
    const title = s.properties.title.toLowerCase();
    return (title.includes('elemento') || title.includes('element') || title.includes('detalle') || title.includes('detail') || title.includes('item')) && s.properties.title !== folderSheetProp?.properties.title;
  }) || sheets[1];

  const folderTabName = folderSheetProp?.properties?.title || 'Carpetas';
  const elementTabName = elementSheetProp?.properties?.title || 'Elementos';

  // 2. Fetch data from both sheets
  const folderDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(folderTabName)}!A1:Z500`;
  const elementDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(elementTabName)}!A1:Z1000`;

  const [folderRes, elementRes] = await Promise.all([
    fetch(folderDataUrl, { headers: { Authorization: `Bearer ${accessToken}` } }),
    fetch(elementDataUrl, { headers: { Authorization: `Bearer ${accessToken}` } })
  ]);

  if (!folderRes.ok) throw new Error(`No se pudo leer la pestaña "${folderTabName}". Verifica su nombre.`);
  if (!elementRes.ok) throw new Error(`No se pudo leer la pestaña "${elementTabName}". Verifica su nombre.`);

  const foldersJson = await folderRes.json();
  const elementsJson = await elementRes.json();

  const folderRows: string[][] = foldersJson.values || [];
  const elementRows: string[][] = elementsJson.values || [];

  return parseRowsToDiaryEntries(folderRows, elementRows);
};
