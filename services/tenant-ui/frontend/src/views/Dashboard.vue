<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <div class="wrap">
    <div class="app">
      <div class="dashboard-title">
        <h1>Dashboard</h1>
      </div>
      <div class="dashboard">
        <div class="dashboard-row">
          <div class="category-block">
            <b class="block-title">Exame</b>
            <i style="color:black;" class="fas fa-vial"></i>
            <Button label="Registrar Exame" @click="navigateTo('/blockchain/exam/register-exam')" class="category-button" />
            <!-- <Button label="Atualizar Exame" @click="navigateTo('/blockchain/exam/update-exam')" class="category-button" /> -->
            <Button label="Listar Exames" @click="navigateTo('/blockchain/exam/list-exams')" class="category-button" />
          </div>
          <div class="category-block">
            <b class="block-title">Diagnóstico</b>
            <i style="color:black;" class="fas fa-diagnoses"></i>
            <Button label="Registrar Diagnóstico" @click="navigateTo('/blockchain/diagnosis/register-diagnosis')" class="category-button" />
            <Button label="Listar Diagnósticos" @click="navigateTo('/blockchain/diagnosis/list-diagnoses')" class="category-button" />
          </div>
        </div>
        <div class="dashboard-row">
          <div class="category-block">
            <b class="block-title">Tratamento</b>
            <i style="color:black;" class="fas fa-pills"></i>
            <Button label="Registrar Tratamento" @click="navigateTo('/blockchain/treatment/register-treatment')" class="category-button" />
            <Button label="Listar Tratamentos" @click="navigateTo('/blockchain/treatment/list-treatments')" class="category-button" />
          </div>
          <div class="other-category-block">
            <b class="block-title">Outras opções</b>
            <i style="color:black;" class="fas fa-list"></i>
            <Button label="Listar Eventos do Sistema" @click="navigateTo('/blockchain/events-ssish')" class="other-category-button" />
            <Button label="Minhas Credenciais Verificáveis" @click="navigateTo('/blockchain/my-verifiable-credentials')" class="other-category-button" />
            <Button label="Minhas Verificações de Credenciais Verificáveis" @click="navigateTo('/blockchain/my-credential-verifications')" class="other-category-button" />
            <Button label="Minha Carteira" @click="navigateTo('/blockchain/my-wallet')" class="other-category-button" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

function navigateTo(route: string) {
  router.push(route);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700');

@mixin object($width, $height, $bg) {
  width: $width;
  height: $height;
  background: $bg;
}

@mixin transPos($top, $right, $bottom, $left, $transX, $transY) {
  position: absolute;
  top: $top;
  left: $left;
  right: $right;
  bottom: $bottom;
  transform: translate($transX, $transY);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

::-webkit-scrollbar {
  display: none;
}

.wrap {
  @include object(375px, 640px, #0d1019);
  font-family: "Open Sans", sans-serif;
  position: relative;
  overflow: hidden;
  .app {
    @include object(375px, 640px, null);
    overflow-y: scroll;
    .statusBar {
      position: fixed;
      z-index: 10;
    }
    header {
      padding: 25px 16px 0 16px;
      .notifHeader {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .userAvatar {
          @include object(35px, 35px, null);
          img {
            border-radius: 50%;
            width: 100%;
            cursor: pointer;
          }
        }
        .options {
          text-align: right;
          i {
            width: 50px;
            color: #fff;
            cursor: pointer;
          }
        }
      }
      .timeStamp {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
        .greet {
          color: #fff;
          p {
            font-size: 16px;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }
          h1 {
            font-size: 40px;
            font-weight: 500;
          }
        }
        .dayIcon {
          @include object(52px, 52px, null);
          i {
            font-size: 60px;
            margin-left: -5px;
            color: yellow;
          }
        }
      }
    }

    .dashboard {
      padding: 16px;
      .dashboard-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .category-block,
      .other-category-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #bcdcff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 48%;
        position: relative;
        overflow: hidden;
        .icon-background {
          position: absolute;
          font-size: 120px;
          color: rgba(255, 255, 255, 0.1);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }
        .block-title {
          color: white;
          font-weight: bold;
          z-index: 1;
        }
        .category-button,
        .other-category-button {
          margin: 0.5rem 0;
          width: 100%;
          border: none;
          background-color: #fff;
          color: #007bff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s, color 0.3s;
          z-index: 1;
          &:hover {
            background-color: #007bff;
            color: #fff;
          }
        }
      }
      .other-category-block {
        background-color: #a69186;
      }
    }
  }
  .tabs {
    @include object(100%, 60px, #161724);
    @include transPos(null, null, 0, 0, null, null);
    display: flex;
    justify-content: space-between;
    .tab {
      width: 25%;
      text-align: center;
      line-height: 70px;
      cursor: pointer;
      transition: 0.4s ease-in-out;
      &:first-child {
        background: darken(#161724, 5%);
      }
      &:hover {
        background: darken(#161724, 5%);
      }
    }
  }
}

@media screen and (max-width: 380px) {
  .wrap {
    @include object(100vw, 100vh, #0d1019);
    .app {
      width: inherit;
      height: inherit;
      overflow-x: hidden;
    }
    .dashboard-row {
      flex-direction: column;
    }
  }
}
</style>
