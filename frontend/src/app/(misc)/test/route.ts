export async function GET() {
  const response = await fetch('http://nginx/api/test');
  const data = await response.json();
  return Response.json(data);
}