new Vue({
    el: '#app',
    data: function() {
      return {
          word: '',
          loading: false,
          results: null
      }
    },
    methods: {
        evaluate: function() {
            this.loading = true;

            axios.get('/api/evaluate/' + this.word)
            .then(response => {
                this.results = response.data;
            })
            .finally(() => {this.loading = false;});
        }
    }
})