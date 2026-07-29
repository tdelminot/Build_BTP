// Générer un ID unique
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Télécharger un fichier
export const downloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Copier dans le presse-papiers
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Exporter en CSV
export const exportToCSV = (data, headers, fileName) => {
  const rows = [];
  rows.push(headers.map(h => h.label).join(','));
  
  data.forEach(item => {
    rows.push(headers.map(h => {
      const value = item[h.key];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(','));
  });

  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, fileName);
};

// Grouper par clé
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Calculer la moyenne
export const average = (array, key = null) => {
  if (!array || array.length === 0) return 0;
  const values = key ? array.map(item => item[key]) : array;
  return values.reduce((sum, val) => sum + val, 0) / array.length;
};

// Calculer le total
export const sum = (array, key = null) => {
  if (!array || array.length === 0) return 0;
  const values = key ? array.map(item => item[key]) : array;
  return values.reduce((sum, val) => sum + val, 0);
};

// Debounce
export const debounce = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};