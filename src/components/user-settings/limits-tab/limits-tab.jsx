import React, { useState, useEffect } from "react"
import { Button, Collapse, Input, Table } from 'antd';
import { ZinEditIcon, ZinDeleteIcon } from "../../images";

export const UserLimitTab = (userlimitdata) => {
    const { Panel } = Collapse;
    const [cardDataList, setCardDataList] = useState(userlimitdata);
    const [UsersLimitData, setUsersData] = useState([userlimitdata]);
    const [disabled, setdisabled] = useState(true);
    const [limitEditSave, selimitEditSave] = useState(false);
    const columns = [
        {
            key: '1',
            dataIndex: 'name',
            title: 'Name',
            ellipsis: true,
            render: (name) =>
                <div> {name} </div>
        },
        {
            key: '2',
            dataIndex: 'role',
            title: 'Role',
            ellipsis: true,
            render: (role) =>
                <div> {role} </div>
        },
        {
            key: '3',
            dataIndex: 'team',
            title: 'Team',
            ellipsis: true,
        },
        {
            key: '4',
            dataIndex: 'used',
            title: 'Used',
            ellipsis: true,
        },
        {
            key: '5',
            dataIndex: 'remaining',
            title: 'Remaining',
            ellipsis: true,
        },
        {
            key: '6',
            dataIndex: 'limits',
            title: 'Limits',
            ellipsis: true,
            width: 120,
            render: (limits) =>
                <div>
                    <Input type="text" defaultValue={limits} disabled={disabled} />
                </div>
        },
        {
            key: '7',
            title: 'Action',
            key: 'action',
            fixed: 'right',
            dataIndex: 'id',
            width: 300,
            render: (dataTT) =>
                <div>
                    {
                        limitEditSave ?
                            <>
                                <div>
                                    <Button type="secondary" size='small' className="me-2">
                                        Cancel
                                    </Button>
                                    <Button type="primary" size='small' onClick={limitSaveCancel}>
                                        Save
                                    </Button>
                                </div>
                            </>
                            :
                            <>
                                <div onClick={() => { limitEdit(dataTT) }} className="cursor-pointer"> <ZinEditIcon /> </div>
                            </>
                    }
                </div>,
            align: 'center',
            className: 'location-action-sticky'
        },
    ];

    const limitEdit = (e) => {
        console.log("limit", e);
        let ids = UsersLimitData[0].props.Email[0].teams[0].data;
        let datas = [];
        const testdfdsf = ids.map((user, i) => {
            if (user.id == e) {
                console.log(ids[i]);
                datas.push(ids[i]);
                return ids[i];

            }
            setdisabled(false)
            selimitEditSave(true);
        });
        // setdisabled(datas);
        console.log("testfgfdg", datas);
        // const filteredusers1 = UsersLimitData.map(filterLimit => {
        //     console.log("filterLimit", filterLimit);

        //     // return filterLimit == e
        // });
        // console.log("filteredusers1", filteredusers1);

        // setdisabled(false);
        // selimitEditSave(true);
    }

    console.log("filteredusers",);

    const limitSaveCancel = () => {
        selimitEditSave(false);
        setdisabled(true);
    }
    return (
        <>
            <div>
                <div className="usersettings-users-limit">
                    <div className=" mt-4 organization-limit">
                        <div className="zn-light-primary-color zn-fs-s zn-fw-500">Organization</div>
                        <div>
                            <span className="zn-light-text-dark02-color zn-fs-s zn-fw-400 me-2">Limit</span>
                            <span className="zn-light-primary-color zn-fs-s zn-fw-500">200</span>
                        </div>
                        <div>
                            <span className="zn-light-text-dark02-color zn-fs-s zn-fw-400 me-2">Used</span>
                            <span className="zn-light-primary-color zn-fs-s zn-fw-500">60</span>
                        </div>
                        <div>
                            <span className="zn-light-text-dark02-color zn-fs-s zn-fw-400 me-2">Remaining</span>
                            <span className="zn-light-primary-color zn-fs-s zn-fw-500">140</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 userlimit-collapse-table">
                    <div >
                        {UsersLimitData.map((user, i) => {
                            let data = user.props.Dice[0].teams;
                            return (
                                <>
                                    {data.map((team, i) => {
                                        let data2 = team.data;
                                        const id = String(i + 1);
                                        return (
                                            <>
                                                <li>
                                                    <div className="new-collapse">
                                                        <div className="d-flex align-items-center gap-5">
                                                            <div className="zn-light-text-dark01-color zn-fs-s zn-fw-500">
                                                                {team.teamname}
                                                            </div>
                                                            <div>
                                                                <span className="zn-light-text-dark02-color zn-fs-s zn-fw-400 me-2">Limit</span>
                                                                <span className="zn-light-primary-color zn-fs-s zn-fw-500">200</span>
                                                            </div>
                                                            <div>
                                                                <span className="zn-light-text-dark02-color zn-fs-s zn-fw-400 me-2">Used</span>
                                                                <span className="zn-light-primary-color zn-fs-s zn-fw-500">60</span>
                                                            </div>
                                                            <div>
                                                                <span className="zn-light-text-dark02-color zn-fs-s zn-fw-400 me-2">Remaining</span>
                                                                <span className="zn-light-primary-color zn-fs-s zn-fw-500">140</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Collapse accordion>
                                                        <Panel key={id}>
                                                            <div className="p-4 pt-2 pb-2">
                                                                <Table columns={columns} dataSource={team.data}
                                                                    scroll={{ x: 600, y: 'calc(100vh -  280px)', overflow: 'overlay' }} />
                                                            </div>
                                                        </Panel>
                                                    </Collapse>
                                                </li>

                                            </>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}