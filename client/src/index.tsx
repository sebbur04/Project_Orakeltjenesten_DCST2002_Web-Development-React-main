import * as React from "react";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import { createHashHistory } from "history";
import { Alert } from "./widgets";


export const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a page

import userService from './service/user-service';

//Import Components for when user is logged in
import AuthTagComp from "./login/tag";
import AuthPageContent from "./login/page";
import EditPage from "./login/edit-page";
import Profile from "./login/profile";
import EditProfile from "./login/profile-edit"
import AuthSidebar from "./login/sidebar";
import NewPage from './login/new-page';
import AuthVersion from './login/version';
import AuthTopBar from './login/topbar';
import Users from './login/users'
import UserPermissions from "./login/userperm";
import Sitemap from './login/sitemap';
import AuthFooter from './login/footer';


//Import components for when user is logged out
import PageContent from './logout/page-content';
import Login from './logout/login';
import SignUp from './logout/signup';
import Sidebar from './logout/sidebar';
import TagPages from './logout/tag-pages';
import PageVersion from './logout/page-version';
import TopBar from './logout/topbar';
import sitemap from './logout/sitemap';
import Footer from './logout/footer';

//Import components that are used by both logged in and logged out
import ProfileView from './same/profile-view'
import Versionlog from './same/page-versionlog';
import AllPages from './same/all-pages';
import Main from './same/main';


//Help from ChatGPT to write code with states here
export function useAuth() {
//ChatGPT har hjulpet til med states her
  const [user, setUser] = useState({ id: 0, username: "", avatar: "", bio: "", permid: 0}); // Initialize with default values

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await userService.getUserAuth(); // Call the API to get the current user
        if (response && response.user) {
          // Update state with the fetched user data
          setUser({ id: response.user.id, username: response.user.username, avatar: response.user.avatar, bio: response.user.bio, permid: response.user.permid });
        }
      } catch (err) {
        console.log(err); // Handle error (e.g., user not authenticated)
      }
    }
    fetchUser(); // Fetch user data on component mount
  }, []); // Run once on component mount

  return { user }; // Return user
}

//Returns different HashRouters if you're authenticated or not. Has the added bonus of stopping a logged out user from accessing any of the components used by a logged in user. 
function App(){

  const authUser = useAuth();

  if(authUser.user.id != 0){ { /* LOGGED IN */}
    //Only return authenticated components / components for authenticated users.
    return(
      <HashRouter>
        <Route path="*" component={AuthTopBar} />
        <div className="page-container">
          <AuthSidebar />
          <div className="mainContent">

          <Alert/>
          <Route exact path="/" component={Main} />
          <Route exact path="/tags/:id" component={AuthTagComp} />
          <Route exact path="/pages/:id" component={AuthPageContent} />
          <Route exact path="/pages/:id/new" component={NewPage} />
          <Route exact path="/pages/:id/edit" component={EditPage} />
          <Route exact path="/pages/:id/versionlog" component={Versionlog} />
          <Route exact path="/pages/:pageid/versionlog/:versionnum" component={AuthVersion} />
          <Route exact path="/profile" component={Profile} /> 
          <Route exact path="/useredit" component={EditProfile} /> 
          <Route exact path="/users/:id" component={ProfileView} />
          <Route exact path="/allpages" component={AllPages} /> 
          <Route exact path="/users" component={Users} />
          <Route exact path="/users/:id/permissions" component={UserPermissions} />
          <Route exact path="/sitemap" component={Sitemap} />
        </div></div>
        <Route exact path="*" component={AuthFooter} />
      </HashRouter>
    )
  } else {
    //Return only components for users that are not authenticated. 
    return(
      <HashRouter>
        <Route path="*" component={TopBar} />
        <div className="page-container">
          <Sidebar />
          <div className="mainContent">
          <Alert/>
          <Route exact path="/" component={Main} />
          <Route exact path="/tags/:id" component={TagPages} />
          <Route exact path="/pages/:id" component={PageContent} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/pages/:id/versionlog" component={Versionlog} />
          <Route exact path="/pages/:pageid/versionlog/:versionnum" component={PageVersion} />
          <Route exact path="/allpages" component={AllPages} /> 
          <Route exact path="/users/:id" component={ProfileView} />
          <Route exact path="/sitemap" component={sitemap} />
        </div>

        </div>
        <Route exact path="*" component={Footer} />
      </HashRouter>
    );
  }
}

export default App;

// Rendering the Application
let root = document.getElementById("root");
if (root)
  createRoot(root).render(<App />);
