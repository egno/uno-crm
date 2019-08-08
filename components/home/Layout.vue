<template>
  <div class="main-page">
    <div class="main-page-sections">
      <slot />

      <section class="easier">
        <div class="content">
          <div class="text-wrapper">
            <div class="main-page__heading">
              ЛЮБИМОЕ ДЕЛО<br>СТАНЕТ ПРОЩЕ
            </div>
            <router-link id="regbutton_maindown" :to="{ name: 'register' }" class="btn" @mousedown.native="$metrika.reachGoal( 'regbutton_maindown')">
              ПОПРОБУЙТЕ БЕСПЛАТНО
            </router-link>
          </div>
        </div>
      </section>
    </div>

    <div class="main-page-sections">
      <section class="footer">
        <div class="content">
          <Links />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Links from '~/components/home/Links.vue'

export default {
  components: {
    Links
  }
}
</script>

<style lang="scss">
@import '~assets/styles/public-sections.scss';

.main-page-sections {
  background: #f3f4f7;

  .hr {
    background: #f3f4f7;
    height: 1px;
  }

  section {
    &.easier {
      height: 276px;
      background: linear-gradient(64.96deg, #c1240f 0%, #ee5742 100%);
      color: #fff;
      @media only screen and (min-width: $tablet) {
        height: 400px;
        background: url('~assets/images/home/bg_easier_tablet.png') right
            center/contain no-repeat,
          linear-gradient(64.96deg, #c1240f 0%, #ee5742 100%);
      }
      @media screen and (min-width: $desktop) {
        height: 600px;
        background: url('~assets/images/home/bg_easier.png') right
            center/contain no-repeat,
          linear-gradient(64.96deg, #c1240f 0%, #ee5742 100%);
      }

      .content {
        flex-wrap: wrap;
        @media only screen and (max-width: 1199px) {
          justify-content: center;
        }
      }
      .text-wrapper {
        max-width: 100%;
        padding: 0;
      }
      .main-page__heading {
        margin-bottom: 40px;
        @media only screen and (max-width: 1199px) {
          text-align: center;
        }
      }
      .btn {
        display: flex;
        min-width: 270px;
        height: 68px;
        align-items: center;
        justify-content: space-around;
        background: #fff;
        color: #07101c;
        text-decoration: none;
        text-align: center;
        font-size: 18px;
        font-weight: 900;
        transition: background-color 0.6s 0s, color 0.6s 0s;
        &:hover {
          color: #fff;
          background: #07101c;
        }
        @media screen and (min-width: $desktop) {
          width: 426px;
        }
      }
    }

    &.footer {
      background: #fff;
      @media only screen and (min-width: $desktop) {
        padding: 118px 0 0;
      }
      .content {
        @media only screen and (min-width: $tablet) {
          max-width: 100%;
        }
        @media only screen and (min-width: $desktop) {
          max-width: $max-container-desktop-width;
          .list {
            margin: 0 -40px;
          }
        }
        @media only screen and (min-width: $wide) {
          max-width: $max-container-wide-width;
        }
      }
      .list {
        width: 100%;
      }
      .additional {
        width: 100%;
        padding: 0;
        overflow: hidden;
        .block {
          display: flex;
          justify-content: flex-start;
          width: 100%;
          padding: 9px 40px;
          border-top: 1px solid rgba(137, 149, 175, 0.1);
          div {
            padding-left: 12px;
            &:after {
              right: 0;
              display: inline-block;
              vertical-align: sub;
              content: '';
              width: 0;
              height: 8px;
              border-right: 1px solid #8995af;
              margin-left: 12px;
              @media only screen and (min-width: $tablet) {
                vertical-align: baseline;
              }
            }
            &:first-child {
              padding-left: 0;
            }
            &:last-child {
              padding-right: 0;
              &:after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .main-page__heading {
    font-size: 24px;
    font-weight: 800;
    @media only screen and (min-width: $tablet) {
      font-size: 40px;
    }
    @media only screen and (min-width: $desktop) {
      font-size: 60px;
    }
  }
}
</style>
