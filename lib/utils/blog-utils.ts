/**
 * Blog Utility Functions
 */

/**
 * Strips HTML tags from content and returns clean text for previews
 * @param htmlContent The HTML content to strip
 * @param maxLength Maximum length of the returned preview text
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(htmlContent: string, maxLength?: number): string {
  if (!htmlContent) return '';
  
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Get the text content without HTML tags
  let plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Trim whitespace and limit length if requested
  plainText = plainText.trim();
  
  if (maxLength && plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength) + '...';
  }
  
  return plainText;
}

/**
 * Creates a safe excerpt from blog content
 * @param content The blog post content
 * @param maxLength Maximum length of the excerpt
 * @returns A clean excerpt for previews
 */
export function createBlogExcerpt(content: string, maxLength: number = 150): string {
  // Handle server-side rendering where document is not available
  if (typeof document === 'undefined') {
    // Simple regex-based HTML tag removal for server-side
    const plainText = content.replace(/<[^>]*>/g, '');
    const trimmed = plainText.trim();
    
    if (trimmed.length <= maxLength) {
      return trimmed;
    }
    
    return trimmed.substring(0, maxLength) + '...';
  }
  
  return stripHtmlTags(content, maxLength);
}

/**
 * Calculates estimated reading time for a blog post
 * @param content The blog post content
 * @param wordsPerMinute Reading speed (default: 200 words per minute)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // Strip HTML tags first
  const plainText = typeof document !== 'undefined' 
    ? stripHtmlTags(content)
    : content.replace(/<[^>]*>/g, '');
    
  // Count words (split by whitespace)
  const wordCount = plainText.split(/\s+/).length;
  
  // Calculate reading time
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Return at least 1 minute
  return Math.max(1, readingTime);
} 