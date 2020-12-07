import React, { Component } from "react";
import { connect } from "react-redux";

export class PageLayout extends Component {
  constructor(props) {
    super(props);
  }
  renderContent() {
    // eslint-disable-next-line react/prop-types
    const WrappedComponent = this.props.component;

    return (
      <>
        <WrappedComponent {...this.props} />
      </>
    );
  }

  render() {
    return <div className="app-container">{this.renderContent()}</div>;
  }
}

const mapStateToProps = (state) => ({
  state: state,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(PageLayout);
