
// Utilitário para sanitização de entrada e proteção XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove tags HTML básicas para prevenção XSS
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Lista de tags permitidas (whitelist approach)
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];
  const allowedAttributes = ['class', 'id'];
  
  // Implementação básica - em produção, usar uma biblioteca como DOMPurify
  let sanitized = html;
  
  // Remove scripts
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '');
  
  // Remove javascript: links
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  return sanitized;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUpperCase) {
    return { isValid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
  }
  
  if (!hasLowerCase) {
    return { isValid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
  }
  
  if (!hasNumbers) {
    return { isValid: false, message: 'Senha deve conter pelo menos um número' };
  }
  
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Senha deve conter pelo menos um caractere especial' };
  }
  
  return { isValid: true };
};

export const rateLimitCheck = (() => {
  const attempts: { [key: string]: number[] } = {};
  
  return (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!attempts[key]) {
      attempts[key] = [];
    }
    
    // Remove tentativas antigas
    attempts[key] = attempts[key].filter(timestamp => timestamp > windowStart);
    
    if (attempts[key].length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    attempts[key].push(now);
    return true;
  };
})();
