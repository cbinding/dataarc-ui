<template>
  <nav
    id="mainNav"
    class="navbar navbar-expand-lg navbar-light navbar-shrink fixed-top"
  >
    <div class="container">
      <a
        class="navbar-brand js-scroll-trigger"
        href="#page-top"
      >DataARC</a>
      <a
        class="navbar-about btn btn-sm btn-outline-dark"
        href="/about"
      >About Our Data</a>
      <button
        class="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="navbarResponsive"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="#page-top"
            >Start</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="#keyword-section"
            >Keyword</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="#temporal-section"
            >Timeline</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="#spatial-section"
            >Map</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="#concept-section"
            >Concepts</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="#why-section"
            >Why</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link js-scroll-trigger"
              href="/auth/login"
            >Login</a>
          </li>
          <!-- <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Manage
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" :to="{name: 'Profile' }">Profile</a>
              <a class="dropdown-item" href="#">Admin</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" @click="handleLogout()">Signout</a>
            </div>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
#mainNav {
  border-color: rgba(34, 34, 34, 0.05);
  background: white;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  transition: all 0.2s;
}

#mainNav .navbar-brand {
  font-weight: 700;
  text-transform: uppercase;
  color: #0089d0;
}

#mainNav .navbar-brand:focus,
#mainNav .navbar-brand:hover {
  color: #0089d0;
}

#mainNav .navbar-about {
  font-size: 11px;
  font-weight: 700;
  border: 1px dashed #eeeeee;
}

#mainNav .navbar-about:hover {
  border-style: solid;
}

#mainNav .navbar-toggle {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #222222;
}

#mainNav .navbar-nav>li.nav-item>a.nav-link:focus,
#mainNav .navbar-nav>li.nav-item>a.nav-link {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #222222;
}

#mainNav .navbar-nav>li.nav-item>a.nav-link:focus:hover,
#mainNav .navbar-nav>li.nav-item>a.nav-link:hover {
  color: #0089d0;
}

#mainNav .navbar-nav>li.nav-item>a.nav-link:focus.active,
#mainNav .navbar-nav>li.nav-item>a.nav-link.active {
  color: #0089d0 !important;
  background-color: transparent;
}

#mainNav .navbar-nav>li.nav-item>a.nav-link:focus.active:hover,
#mainNav .navbar-nav>li.nav-item>a.nav-link.active:hover {
  background-color: transparent;
}

#mainNav > .container > #navbarResponsive {
    margin: 10px 0px;
}

@media (min-width: 992px) {
  #mainNav {
    border-color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
  }
  #mainNav .navbar-brand {
    color: rgba(255, 255, 255, 0.7);
  }
  #mainNav .navbar-brand:focus,
  #mainNav .navbar-brand:hover {
    color: white;
  }
  #mainNav .navbar-nav>li.nav-item>a.nav-link,
  #mainNav .navbar-nav>li.nav-item>a.nav-link:focus {
    color: rgba(255, 255, 255, 0.7);
  }
  #mainNav .navbar-nav>li.nav-item>a.nav-link:hover,
  #mainNav .navbar-nav>li.nav-item>a.nav-link:focus:hover {
    color: white;
  }
  #mainNav.navbar-shrink {
    border-color: rgba(34, 34, 34, 0.05);
    background-color: white;
  }
  #mainNav.navbar-shrink .navbar-brand {
    font-size: 16px;
    color: #0089d0;
  }
  #mainNav.navbar-shrink .navbar-brand:focus,
  #mainNav.navbar-shrink .navbar-brand:hover {
    color: #0089d0;
  }
  #mainNav.navbar-shrink .navbar-nav>li.nav-item>a.nav-link,
  #mainNav.navbar-shrink .navbar-nav>li.nav-item>a.nav-link:focus {
    color: #222222;
  }
  #mainNav.navbar-shrink .navbar-nav>li.nav-item>a.nav-link:hover,
  #mainNav.navbar-shrink .navbar-nav>li.nav-item>a.nav-link:focus:hover {
    color: #0089d0;
  }
}
</style>
