import styled from "styled-components"

export const StyledColEditor = styled.div`
  .active .col-stat{
    display: block !important;
  }
  .show {
    display: block !important;
  }
  .col_item{
    position: relative;
    padding:3px 0px;
    /* overflow-x: scroll; */
  }
  @media screen and (max-width: 900px) {
    .col_item{
        width: 100% !important;
     }
     .col-drag{
        display: none;
     }
     .col-container{
      flex-direction: column;
     }
  }
  .col-stat{
    color:#fff;
    background:rgba(0,0,0,0.3);
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 3px;
    font-size: 12px;
    padding: 1px 2px;
    /* transform: scale(0.5); */
    transform-origin: right top;
    display: none;
  }

  .col-container .col_item{
    background: rgba(100, 106, 115, 0.02);
    border-radius: 5px;
  }
  .col-container:hover .col_item{
    background: rgba(100, 106, 115, 0.05);
    border-radius: 5px;
  }


  .col-drag {
    width:2px;
    margin:0 auto;
    padding:3px 8px;
    display:flex;
    justify-items: center;
    justify-content: center;
    align-items: center;
    cursor:col-resize;
    border-radius: 20px;
    position: relative;
  }
  .col-drag:hover .col-drag-line{
    opacity: 1;
  }
  .opacity-100{
    opacity: 1 !important;
  }
  .col-drag-line{
    opacity: 0;
    transition: all .3s;
    display:flex;
    cursor:col-resize;
    width:2px;
    min-width:2px;
    min-height:20px;
    height:calc(100% - 16px);
    padding:1px 1px;
    justify-items: center;
    align-items: center;
    background-color: #336df4;
    justify-content: center
  }
  .col-container .col-drag:last-child {
    display: none;
  }

  .col-drag:hover .col-drag-plus{
    opacity: 1;
  }

  .col-drag-plus{
    background: red;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    opacity: 0;
    position: absolute;
    top:-8px;
    cursor: pointer;
  }
`
