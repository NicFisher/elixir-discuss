import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", resp => {
      renderComments(resp.comments);
      console.log("Joined successfully", resp)
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value

    channel.push('comment:add', { content: content })
  })
}

function renderComments(comments) {
  const renderComments = comments.map(comment => {
    return `
      <li class="collection-item">
        ${comment.content}
      </li>
    `;
  })

  document.querySelector('.collection').innerHTML = renderComments.join('')
}

window.createSocket = createSocket
