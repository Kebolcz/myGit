import '../assets/styles/footer.styl'

export default {
  data() {
    return {
      name: 'Kebo'
    } 
  },
  render() {
    return (
      <footer id="footer">
        <span>written by {this.name}</span>
      </footer>
    )
  }
}