(function(){
  const firebaseConfig = {
    apiKey: "AIzaSyCG97TbGDVQrMXrWAwX6BEomY0za-RwAHg",
    authDomain: "testmp4-69da7.firebaseapp.com",
    databaseURL: "https://testmp4-69da7.firebaseio.com",
    projectId: "testmp4-69da7",
    storageBucket: "testmp4-69da7.appspot.com",
    messagingSenderId: "878000337213",
    appId: "1:878000337213:web:f37eb95a024a7c79ae9554",
    measurementId: "G-VEFZW9KSXQ"
  };
  firebase.initializeApp(firebaseConfig);
  new Vue({
    el: '#app',
    data() {
      return {
        music:'',
        load:'',
        id: 0,
        file:{},
        video:[],
        noclick:false,
        progress:{
          start:0,
          total:0,
          progress:0,
        },
      }
    },
    mounted() {
      this.getfile();
    },
    methods: {
      togglemusic(get,index){
        this.music = get;
        this.id = index;
        this.load.load();
      },
      end(){
        this.video.some((item,num) => {
          if(item.fileUrl.indexOf(this.music) !== -1){
            this.id = num;
          }
          return item.fileUrl.indexOf(this.music) !== -1;
        });
        if(this.id + 1 > this.video.length -1){
          this.music = this.video[0].fileUrl;
          this.id = 0;
        }else{
          this.music = this.video[this.id + 1].fileUrl;
          this.id += 1;
        }
        this.load.load();
      },
      upload(){
        let file = this.$refs.file.files[0];
        if(file === undefined) return false;
        if((file.size / 1000000) > 100) {
          alert('請勿上傳超過100MB檔案');
          return false;
        };

        if(file.type.split('/')[1] !== 'mp4') {
          alert('請勿上傳不是mp4格式的檔案');
          return false;
        };
        let storage = firebase.storage().ref();
        this.noclick = true;
        const uploadTask = storage.child(`mp4/${file.name}`).put(file);
        uploadTask.on('state_changed', (snapshot) => {
          this.progress.start = (snapshot.bytesTransferred / 1000000).toFixed(1);
          this.progress.total = (snapshot.totalBytes / 1000000).toFixed(1);
          this.progress.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 200;
        }, () => {
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.file = {
              fileUrl: downloadURL,
              name: file.name,
              type: file.type.split('/')[1],
            };
          }).then(() => {
            this.progress.start = 0;
            this.progress.total = 0;
            this.progress.progress = 0;
            this.updatefile();
          });
        });
      },
      updatefile(){
        firebase.database().ref('/file').push(this.file);
        this.getfile();
      },
      getfile(){
        var starCountRef = firebase.database().ref('/file');
        starCountRef.on('value', (snapshot) => {
          if (snapshot.val() === null) return false;
          this.video = Object.values(snapshot.val());
          this.music = this.video[0].fileUrl;
          this.noclick = false;
          this.$nextTick(()=>{
            this.load = document.querySelector('.video1');
            this.load.volume = 0.25;
            this.load.play();
          })
        });
      }
    },
  })
})(Vue)