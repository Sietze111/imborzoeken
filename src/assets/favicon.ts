// Import the favicon
import favicon from './favicon.ico';

// Update favicon link
const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (link) {
  link.href = favicon;
}
