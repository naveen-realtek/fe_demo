import { Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { overlayMenuData } from './overlay-menudata';
import './index.scss';

export const OverlayMenuDropdown = (props) => {
    return (
        <>
            <Menu className="overlay-menu-height">
                {overlayMenuData.map((user) => {
                    let textnew = user.menutitle;
                    if (textnew == props.type) {
                        let text = user.mainmenus;
                        console.log(textnew);
                        return (
                            <>
                                {text.map((view) => {
                                    return (
                                        <>
                                            <Menu.Item>
                                                <Link to={`/app/admin/${view.menulink}`}>
                                                    {view.menuItem}
                                                </Link>
                                            </Menu.Item>
                                        </>
                                    )
                                })}
                            </>
                        )
                    }
                })}
            </Menu>
        </>
    )
}