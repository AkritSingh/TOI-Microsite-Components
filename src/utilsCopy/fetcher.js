const getJSON = (url) => fetch(url).then((res) => res.json())

export default {
  getJSON,
}
