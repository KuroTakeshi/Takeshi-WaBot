const axios = require("axios");
const cheerio = require("cheerio");

class AppleMusic {
  search = async function search(q) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          "https://music.apple.com/id/search?term=" + encodeURIComponent(q),
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
          }
        );

        let $ = cheerio.load(response.data);
        let array = [];

        $(".shelf-grid__body ul li .track-lockup").each((index, element) => {
          try {
            const titleElement = $(element).find(".track-lockup__content li").eq(0).find("a");
            const title = titleElement.text().trim();
            const albumUrl = titleElement.attr("href") || "";

            let songUrl = "";
            if (albumUrl) {
              const urlParts = albumUrl.split("/");
              const lastPart = urlParts[urlParts.length - 1] || "";
              const idMatch = albumUrl.match(/i=(\d+)/);
              const id = idMatch ? idMatch[1] : "";

              songUrl = albumUrl
                .replace(lastPart, "")
                .trim()
                .replace("/album/", "/song/")
                .trim() + id;
            }

            let imageUrl = "";
            const imageElement = $(element).find(".svelte-3e3mdo source").eq(1);
            if (imageElement.length) {
              const srcset = imageElement.attr("srcset");
              if (srcset) {
                const srcsetParts = srcset.split(",");
                if (srcsetParts.length > 1) {
                  const urlPart = srcsetParts[1].trim().split(/\s+/);
                  if (urlPart.length > 0) {
                    imageUrl = urlPart[0];
                  }
                }
              }
            }

            const artistElement = $(element).find(".track-lockup__content li").eq(1).find("a");
            const artist = {
              name: artistElement.text().trim(),
              url: artistElement.attr("href") || ""
            };

            if (title && songUrl) {
              array.push({
                title,
                image: imageUrl,
                song: songUrl,
                artist
              });
            }
          } catch (error) {
            console.error(`Error processing track ${index}:`, error);
          }
        });

        resolve(array);
      } catch (error) {
        console.error("Search error:", error);
        reject(new Error("Failed to search Apple Music"));
      }
    });
  };

  download = async function download(url) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!url || !url.includes("music.apple.com")) {
          return reject(new Error("Invalid Apple Music URL"));
        }

        const response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });

        let $ = cheerio.load(response.data);
        const scriptContent = $("script").eq(0).text();

        if (!scriptContent) {
          return reject(new Error("No metadata found on page"));
        }

        let json;
        try {
          json = JSON.parse(scriptContent);
        } catch (parseError) {
          return reject(new Error("Failed to parse metadata"));
        }

        if (!json.audio) {
          return reject(new Error("Audio metadata not found"));
        }

        const metadata = {
          name: json.audio.name || "Unknown",
          url: json.audio.url || url,
          duration: json.audio.duration || null,
          artist: {
            name: json.audio.byArtist?.[0]?.name || "Unknown",
            url: json.audio.byArtist?.[0]?.url || null
          },
          album: {
            name: json.audio.inAlbum?.name || "Unknown",
            url: json.audio.inAlbum?.url || null
          }
        };

        const searchResponse = await axios.get(
          "https://aaplmusicdownloader.com/api/composer/ytsearch/mytsearch.php",
          {
            params: {
              name: metadata.name,
              artist: metadata.artist.name,
              album: metadata.album.name,
              link: metadata.url
            }
          }
        ).catch(error => ({ data: { error: error.message } }));

        if (!searchResponse.data?.videoid) {
          return reject(new Error(searchResponse.data?.error || "No video ID found"));
        }

        const downloadResponse = await axios.get(
          "https://aaplmusicdownloader.com/api/ytdl.php?q=" + searchResponse.data.videoid
        ).catch(error => ({ data: { error: error.message } }));

        if (!downloadResponse.data?.dlink) {
          return reject(new Error(downloadResponse.data?.error || "No download link found"));
        }

        resolve({
          metadata,
          download: {
            url: downloadResponse.data.dlink,
            videoId: searchResponse.data.videoid
          }
        });
      } catch (error) {
        console.error("Download error:", error);
        reject(new Error("Failed to process download"));
      }
    });
  };
}

module.exports = new AppleMusic();