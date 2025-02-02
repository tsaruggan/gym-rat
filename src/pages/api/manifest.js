export default function handler(req, res) {
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId.' });
    }
  
    const manifest = {
      name: `Gym Rat`,
      short_name: `Gym Rat`,
      theme_color: "#FFFFFF",
      background_color: "#FFFFFF",
      start_url: `/${userId}`,
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: "/icon.jpg",
          sizes: "1536x1536",
          type: "image/jpeg"
        },
        {
          src: "/favicon.ico",
          sizes: "48x48",
          type: "image/x-icon"
        }
      ]
    };
  
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(manifest);
  }
  