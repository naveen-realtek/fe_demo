import React, { useState } from "react";
import { Breadcrumb, Tabs } from 'antd';
import { Link } from "react-router-dom";
import { ZinRightArrow } from "../../../images";
import { SubmissionsInternalStatusTab, SubmissionsStatusTab } from "../internal-status/internal-status";
import { submissionstatusdata } from "../../../../pages/master/submissions/data";
import { SubmissionsExternalStatusTab } from "../external-status/external-status";

export const SubmissionsStatus = () => {
    const items = [
        { label: 'Internal Submission Status', key: 'item-1', children: <SubmissionsInternalStatusTab props={submissionstatusdata} /> }, // remember to pass the key prop
        { label: 'Client Submission Status', key: 'item-2', children: <SubmissionsExternalStatusTab props={submissionstatusdata} /> },
    ];
    return (
        <>
            <div className="admin-breadcrums">
                <div className='d-flex w-100 justify-content-between align-items-center'>
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
                        <Breadcrumb.Item> Masters </Breadcrumb.Item>
                        <Breadcrumb.Item> Submission </Breadcrumb.Item>
                        <Breadcrumb.Item> Status </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className="common-SpaceAdmin">
                <div className="submission-tags-ant-table">
                    <Tabs items={items} />
                </div>
            </div>
        </>
    )
}


