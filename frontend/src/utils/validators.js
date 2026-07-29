export const validators = {
  // Email
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  },

  // Mot de passe (8 caractères, majuscule, minuscule, chiffre)
  password: (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(value);
  },

  // Téléphone
  phone: (value) => {
    const regex = /^[0-9+\s-]{10,15}$/;
    return regex.test(value);
  },

  // URL
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // Nombre
  number: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // Montant
  amount: (value) => {
    return validators.number(value) && parseFloat(value) >= 0;
  },

  // Date
  date: (value) => {
    return !isNaN(new Date(value).getTime());
  },

  // UUID
  uuid: (value) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(value);
  },

  // SIRET
  siret: (value) => {
    const regex = /^[0-9]{14}$/;
    return regex.test(value);
  },

  // Code postal
  postalCode: (value) => {
    const regex = /^[0-9]{5}$/;
    return regex.test(value);
  },

  // Requis
  required: (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  // Longueur minimale
  minLength: (value, length) => {
    return String(value).length >= length;
  },

  // Longueur maximale
  maxLength: (value, length) => {
    return String(value).length <= length;
  },

  // Entre deux valeurs
  between: (value, min, max) => {
    const num = parseFloat(value);
    return num >= min && num <= max;
  }
};

// Validateur pour les formulaires
export const validateForm = (values, rules) => {
  const errors = {};

  for (const field in rules) {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const { validator, message } = rule;
      
      if (typeof validator === 'function') {
        if (!validator(value)) {
          errors[field] = message;
          break;
        }
      } else if (validator === 'required' && !validators.required(value)) {
        errors[field] = message;
        break;
      }
    }
  }

  return errors;
};

export default validators;