const button = document.getElementById('btn-heart')
button.addEventListener('click', function (e) {
  console.log('button was clicked')

  console.log(photo_id)

  fetch(`/photos/${photo_id}/likes`, { method: 'POST' })
    .then(function (response) {
      if (response.ok) {
        console.log('Click was recorded')
        return
      }
      throw new Error('Request failed.')
    })
    .catch(function (error) {
      console.log(error)
    })
})
