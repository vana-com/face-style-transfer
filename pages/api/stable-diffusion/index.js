const API_HOST = "https://api.replicate.com";

// Copied from https://github.com/replicate/inpainter
// Very similar to /api/predictions but I didn't want to deal
// with passing a URL around
export default async function handler(req, res) {
  // console.log('going to make prediction')

  const response = await fetch(
    "https://replicate.com/api/models/stability-ai/stable-diffusion/versions/5b703f0fa41880f918ab1b12c88a25b468c18639be17515259fb66a83f4ad0a4/predictions", 
  {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  // console.log('made prediction')

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}