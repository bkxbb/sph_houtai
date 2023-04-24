<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <svg t="1682148432623" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2477" width="16" height="16"><path d="M542.72 317.44c0 17.408-13.312 30.72-30.72 30.72s-30.72-13.312-30.72-30.72 13.312-30.72 30.72-30.72 30.72 13.312 30.72 30.72z m-30.72 61.44c-17.408 0-30.72 14.336-30.72 30.72v296.96c0 17.408 13.312 30.72 30.72 30.72s30.72-14.336 30.72-30.72V409.6c0-17.408-13.312-30.72-30.72-30.72z m460.8 133.12c0 253.952-206.848 460.8-460.8 460.8S51.2 765.952 51.2 512 258.048 51.2 512 51.2s460.8 206.848 460.8 460.8z m-40.96 0C931.84 280.576 743.424 92.16 512 92.16S92.16 280.576 92.16 512s188.416 419.84 419.84 419.84 419.84-188.416 419.84-419.84z" p-id="2478"></path></svg>
    </div>
    <div class="card-content">{{count}}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'',
  props:['title','count']
}
</script>

<style>
  .card-header{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
  }
  .card-content{
    font-size: 30px;
    padding: 10px 0px;
  }
  .card-charts{
    height: 50px;
  }
  .card-footer{
    border-top: 1px solid #eee;
    padding-top: 10px;
  }
</style>