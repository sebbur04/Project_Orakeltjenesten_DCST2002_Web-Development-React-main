import React from "react";
import { Component } from "react-simplified";

//Services
import pageService, { Page } from "../service/page-service";

//Component imports
import { Form } from "../widgets";
import { history } from "../index";

/*Most of the functionality is done without AI
except the idea of using states for the dissapearing result-list,
as updating a this.isVisible object did not work. */
class SearchBar extends Component {
  allPages: Page[] = [];
  pagesSearch: Page[] = [];
  searchInput: string = "";

  //chatGPT
  searchBarRef = React.createRef<HTMLDivElement>(); // Ref to the search bar container
  //chatGPT
  state = {
    isVisible: false, // Keep track of visibility in the state
  };

  //chatGPT. Checks if the outside div of the searchbar is the target of the mousedown event.
  handleClickOutside = (event: MouseEvent) => {
    if (
      this.searchBarRef.current &&
      !this.searchBarRef.current.contains(event.target as Node)
    ) {
      this.setState({ isVisible: false });
    } else {
      this.setState({ isVisible: true });
    }
  };

  render() {
    return (
      <div className="searchbar-container" ref={this.searchBarRef}>
        <Form.Input
          className="searchbar"
          type="text"
          placeholder="Søk her..."
          value={this.searchInput}
          onChange={(event) => {
            //Only setState syntax is chatGPT here
            this.setState({ isVisible: true });

            this.searchInput = event.currentTarget.value;

            //Filters out pages which do not include the search input.
            this.pagesSearch = this.allPages.filter((x) =>
              x.name.toLowerCase().includes(this.searchInput.toLowerCase())
            );
          }}
        ></Form.Input>
        {/*Renders the result-list only if there are results and isVisible is true.*/}
        {this.state.isVisible && this.searchInput != "" && (
          <ul className="suggestions-list">
            {this.pagesSearch.map((page) => (
              <li
                className="search-list"
                key={page.id}
                onClick={() => {
                  this.searchInput = "";
                  this.setState({ isVisible: false });
                  pageService.updatePageViews(page.id);
                  history.push(`/pages/${page.id}`);
                }}
              >
                {page.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  async mounted() {
    //Gets all pages
    const pagesResult = await pageService.getAllPages();

    if (pagesResult) {
      this.allPages = pagesResult;
    }

    //Mounts a listener which runs the this.handleClickOutside method when called, chatGPT
    document.addEventListener("mousedown", this.handleClickOutside);
  }
}

export default SearchBar;
