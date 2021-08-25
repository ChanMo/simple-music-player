export const domain = 'https://mpoc.dsoou.com'

export async function fetchTracks() {
  const url = domain + '/api/v2/albums/random/?limit=10'
  try {
    const res = await fetch(url)
    const resJson = await res.json()
    let tracks = []
    resJson.map(row => {
      tracks.push({
        url: `${domain}${row.media}`,
        title: row.title,
        artist: row.artist.nickname,
        artwork: `${domain}${row.album_cover}`,
        duration: 200
      })
    })
    return tracks
  } catch (err) {
    console.warning(err)
  }
}
