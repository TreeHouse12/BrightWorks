import React from "react";
import ReactDOM from "react-dom";

class State extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "NC" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

    handleChange(event) {
       this.setState({ value: event.target.value });
     }

  handleSubmit(event) {
    alert("Your state is: " + this.state.value);
    event.preventDefault();
  }

//  handleChange = event => {
//    this.setState({ value: event.target.value });
//  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDOM.render(<State />, document.querySelector("#root"));
