import { PasswordOptions, PasswordStrength, CHARACTER_SETS } from './types';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeUppercase) charset += CHARACTER_SETS.uppercase;
  if (options.includeLowercase) charset += CHARACTER_SETS.lowercase;
  if (options.includeNumbers) charset += CHARACTER_SETS.numbers;
  if (options.includeSymbols) charset += CHARACTER_SETS.symbols;

  if (!charset) {
    // Default to lowercase if nothing selected
    charset = CHARACTER_SETS.lowercase;
  }

  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !CHARACTER_SETS.similar.includes(char)).join('');
  }

  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export function calculateStrength(password: string, options: PasswordOptions): PasswordStrength {
  let score = 0;

  // Length score
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  // Character variety
  if (options.includeUppercase && /[A-Z]/.test(password)) score += 1;
  if (options.includeLowercase && /[a-z]/.test(password)) score += 1;
  if (options.includeNumbers && /[0-9]/.test(password)) score += 1;
  if (options.includeSymbols && /[^A-Za-z0-9]/.test(password)) score += 1;

  // Length bonus
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very-strong';
}

export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'text-red-400';
    case 'medium':
      return 'text-yellow-400';
    case 'strong':
      return 'text-green-400';
    case 'very-strong':
      return 'text-emerald-400';
    default:
      return 'text-white/60';
  }
}

export function getStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
    case 'very-strong':
      return 'Very Strong';
    default:
      return 'Unknown';
  }
}
