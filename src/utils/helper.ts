export function editUrl(url: string) {
  const urlEnd = url.split('/').pop() as string;
  const filterUrl = url.split(urlEnd)[0];
  return filterUrl;
};