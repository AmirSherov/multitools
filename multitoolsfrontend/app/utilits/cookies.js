/**
 * Устанавливает cookie
 * @param {string} name - имя cookie
 * @param {string} value - значение cookie
 * @param {number} days - срок действия в днях
 */
export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Получает значение cookie по имени
 * @param {string} name - имя cookie
 * @returns {string|null} значение cookie или null
 */
export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Удаляет cookie
 * @param {string} name - имя cookie
 */
export function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
} 