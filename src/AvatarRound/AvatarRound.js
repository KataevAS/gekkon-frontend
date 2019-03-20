import React, {Component} from 'react';
import './AvatarRound.css';

export default class AvatarRound extends Component {
    render() {
        return <a className="avatar-round">
            {this.props.user ? (this.props.user.avatar ? <img src={this.props.user.avatar.url} alt={this.props.user.name ? this.props.user.name : this.props.user.login}/> :
                <img src="/public/user-icon/no-avatar.jpg" alt={this.props.user.name ? this.props.user.name : this.props.user.login}/>) :
                <img src="/public/user-icon/guest.jpg" alt="Гость"/>}
        </a>;
    }
}