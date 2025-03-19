import React, { useState } from "react";
import { Breadcrumb, Tabs } from 'antd';
import { ZinRightArrow } from "../../images";
import { Link } from "react-router-dom";
import { UserLimitTab } from "../limits-tab/limits-tab";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { userlimitdata } from "../../../pages/user-settings/limit/limit-data";

export const UserLimit = () => {
    const [subTags, setSubTags] = useState(userlimitdata);
    let data = Object.keys(subTags);
    let objectLength = Object.keys(userlimitdata).length

    const items = new Array(objectLength).fill(null).map((_, i, newid) => {
        const id = String(i + 1);
        console.log("data: ", data[i]);
        const data1 = subTags[data[i][0]];
        console.log("data 1:", data1);
        return {
            label: data[i],
            key: id,
            children: <UserLimitTab props={userlimitdata} />
        };
    });
    return (
        <div className="">
            <div className="admin-breadcrums">
                <Breadcrumb className="breadcrum-dropdown" separator={<ZinRightArrow />}>
                    <Breadcrumb.Item>
                        <Link to='/app/dashboard'>
                            Home
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/app/admin'>
                            Admin
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item overlay={<OverlayMenuDropdown type="User settings" />}>
                        User settings
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Limits</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="common-SpaceAdmin">
                <div className="user-limits-Tab">
                    <Tabs items={items} />
                </div>
            </div>
        </div>
    )
}
