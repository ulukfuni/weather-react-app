import React, { Component } from 'react';
import styled from 'styled-components';

const MarginBtn = styled.button`
    margin: 15px;
`;
class Btn extends Component {
    handleClick = () => {
        let { index, onClick } = this.props;
        return index ? onClick(index) : onClick();
    }
    render() {
        return (
            <MarginBtn role="button" className="btn btn-secondary d-inline-block" onClick={this.handleClick}>{this.props.children}</MarginBtn>
        )
    }
}
export default Btn;