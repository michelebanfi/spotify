const axios = require("axios");
let data = {};
//token for authorize api requests
let token = 'Bearer <toke>';
const names = async () => {
    axios.get('https://api.spotify.com/v1/me/playlists', {
        params:{
            'limit': '50', 
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": token
        }
    }).then(response => getArtistsNames(response.data.items))

}
const getArtistsNames = list => {
    list.map(item => {
        //this if is a filter for some playlist name exceptions
        if (!(false)) {
            data[`${item.name}`] = { nome: item.name, playListId: item.id, artistId: '', artistImage: '' };
            getArtistId(item.name);
        }
    });
}
const getArtistId = name => {
    axios.get('https://api.spotify.com/v1/search', {
        params: {
            "q": name,
            "type": "artist",
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": token
        }
    }).then(response => {
        if (response.data.artists.items[0] !== undefined) {
            data[`${name}`].artistId = response.data.artists.items[0].id;
            getArtistImage(response.data.artists.items[0].id, name);
        }else{
            console.log(name);
        }
    })
}
const getArtistImage = (id, name) => {
    axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": token
        }
    }).then(response => {
        data[`${name}`].artistImage = response.data.images[0].url;
        putPlaylistImage(data[`${name}`].playListId, name);
    })
}
const putPlaylistImage = async (id, name) => {
    let base64 = await getBase64(data[`${name}`].artistImage)
    axios({
        method: 'put',
        url: `https://api.spotify.com/v1/playlists/${id}/images`,
        headers: {
            "Content-Type": 'image/jpeg',
            "Authorization": token
        },
        data: base64,
    })
        .then(response => console.log(response.status))
        .catch(e => console.log(error));
}
function getBase64(url) {
    return axios
        .get(url, {
            responseType: 'arraybuffer'
        })
        .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}
names();

