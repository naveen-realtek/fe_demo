import { Breadcrumb, Checkbox, CheckboxGroup } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OverlayMenuDropdown } from '../../../shared-components/overlay-menu/overlay-menu';
import { ZinRightArrow, ZinSolidUsers } from '../../images';

export const UserRolesView = (props) => {
    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    const rolesdata = [
        {
            key: 1,
            mainmodulesname: "Jobs",
            mainmodulesAdd: 2,
            mainmodulesView: 3,
            mainmodulesEdit: 2,
            mainmodulesDelete: 3,
            groupmodule: null,
            submodules: null,
        },
        {
            key: 2,
            mainmodulesname: "Candidates",
            mainmodulesAdd: 2,
            mainmodulesView: 3,
            mainmodulesEdit: 2,
            mainmodulesDelete: 3,
            groupmodule: null,
            submodules: null,
        },
        {
            key: 3,
            mainmodulesname: null,
            groupmodule: [
                {
                    groupmodulestitle: 'Network',
                    groupmodulesAdd: 0,
                    groupmodulesView: 0,
                    groupmodulesEdit: 1,
                    groupmodulesDelete: 0,
                }
            ],
            submodules: [
                {
                    submodulesname: "Vendors",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Hotlist",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 3,
                    submodulesDelete: 0,
                },
            ]
        },
        {
            key: 4,
            mainmodulesname: null,
            groupmodule: [
                {
                    groupmodulestitle: 'Campaigns',
                    groupmodulesAdd: 0,
                    groupmodulesView: 0,
                    groupmodulesEdit: 1,
                    groupmodulesDelete: 0,
                }
            ],
            submodules: [
                {
                    submodulesname: "Promotions",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Engagement",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 3,
                    submodulesDelete: 0,
                },
            ]
        },
        {
            key: 5,
            mainmodulesname: "Scheduler",
            mainmodulesAdd: 2,
            mainmodulesView: 3,
            mainmodulesEdit: 2,
            mainmodulesDelete: 3,
            groupmodule: null,
            submodules: null,
        },
        {
            key: 6,
            mainmodulesname: null,
            groupmodule: [
                {
                    groupmodulestitle: 'Collaborate',
                    groupmodulesAdd: 0,
                    groupmodulesView: 0,
                    groupmodulesEdit: 1,
                    groupmodulesDelete: 0,
                }
            ],
            submodules: [
                {
                    submodulesname: "Team Chat",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
            ]
        },
        {
            key: 7,
            mainmodulesname: "Reports",
            mainmodulesAdd: 2,
            mainmodulesView: 3,
            mainmodulesEdit: 2,
            mainmodulesDelete: 3,
            groupmodule: null,
            submodules: null,
        },
        {
            key: 6,
            mainmodulesname: null,
            groupmodule: [
                {
                    groupmodulestitle: 'Admin Setup',
                    groupmodulesAdd: 0,
                    groupmodulesView: 0,
                    groupmodulesEdit: 1,
                    groupmodulesDelete: 0,
                }
            ],
            submodules: [
                {
                    submodulesname: "Organization Settings",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "User Settings",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Notification Settings",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: " Plans and Billing",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Career Site",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Templates",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Masters ",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Rules",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Payment and Invoice",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
                {
                    submodulesname: "Payment and Invoice",
                    submodulesAdd: 0,
                    submodulesView: 0,
                    submodulesEdit: 2,
                    submodulesDelete: 0,
                },
            ]
        },
    ];



    const [checkedAll, setCheckedAll] = useState(false);
    const [checked, setChecked] = useState({
        nr1: false,
        nr2: false
    });

    /* ################################################ */
    /* #### TOGGLES checK STATE BASED ON inputName #### */
    /* ################################################ */

    const toggleCheck = (inputName) => {
        setChecked((prevState) => {
            const newState = { ...prevState };
            newState[inputName] = !prevState[inputName];
            return newState;
        });
    };

    /* ###################################################### */
    /* #### CHECKS OR UNCHECKS ALL FROM SELECT ALL CLICK #### */
    /* ###################################################### */

    const selectAll = (value) => {
        setCheckedAll(value);
        setChecked((prevState) => {
            const newState = { ...prevState };
            for (const inputName in newState) {
                newState[inputName] = value;
            }
            return newState;
        });
    };

    /* ############################################# */
    /* #### EFFECT TO CONTROL CHECKED_ALL STATE #### */
    /* ############################################# */

    // IF YOU CHECK BOTH INDIVIDUALLY. IT WILL ACTIVATE THE checkedAll STATE
    // IF YOU UNCHECK ANY INDIVIDUALLY. IT WILL DE-ACTIVATE THE checkAll STATE

    useEffect(() => {
        let allChecked = true;
        for (const inputName in checked) {
            if (checked[inputName] === false) {
                allChecked = false;
            }
        }
        if (allChecked) {
            setCheckedAll(true);
        } else {
            setCheckedAll(false);
        }
    }, [checked]);




    return (
        <div>
            <div className='admin-breadcrums'>
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
                    <Breadcrumb.Item overlay={<OverlayMenuDropdown type="User settings" />} >
                        User settings
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to='/app/admin/usersettings/roles'>
                            Roles
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Manager
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className='common-SpaceAdmin'>
                <div className='zn-card'>
                    <div className='zn-card-body '>
                        <div className='roles-list'>
                            <div className='d-flex justify-content-between p-3 roles-list-item zn-fs-s mb-2'>
                                <div className='me-3'>
                                    <div className=' zn-light-primary-color'>
                                        Manager
                                    </div>
                                    <div className='zn-light-text-dark-color'>
                                        Manages a team of recruiters, assess jobs and approves profiles submitted to client.
                                    </div>
                                </div>
                                <div className='align-self-center zn-light-text-dark-color d-flex'>
                                    <ZinSolidUsers />&nbsp;&nbsp;01
                                </div>
                            </div>
                        </div>
                        <div className='roles-active-sec'>
                            <div className='table-responsive '>
                                <table className='col-md-10 roles-active-table'>
                                    <thead>
                                        <tr>
                                            <th>Modules</th>
                                            <th className='text-center'>Add</th>
                                            <th className='text-center'>View</th>
                                            <th className='text-center'>Edit</th>
                                            <th className='text-center'>Delete</th>
                                        </tr>
                                    </thead>
                                    {rolesdata.map((rolesdata, index) => {
                                        return (
                                            <>
                                                {
                                                    rolesdata.mainmodulesname == null ? <> </> : <>
                                                        <tbody>
                                                            <tr key={index}>
                                                                <th>{rolesdata.mainmodulesname}</th>
                                                                <th className='text-center'>
                                                                    {rolesdata.mainmodulesAdd === 0 ? <><Checkbox onChange={onChange} /></>
                                                                        : rolesdata.mainmodulesAdd === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                            : rolesdata.mainmodulesAdd === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                : rolesdata.mainmodulesAdd === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                    : <> </>}
                                                                </th>
                                                                <th className='text-center'>

                                                                    {rolesdata.mainmodulesView === 0 ? <><Checkbox onChange={onChange} /></>
                                                                        : rolesdata.mainmodulesView === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                            : rolesdata.mainmodulesView === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                : rolesdata.mainmodulesView === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                    : <> </>}
                                                                </th>
                                                                <th className='text-center'>
                                                                    {rolesdata.mainmodulesEdit === 0 ? <><Checkbox onChange={onChange} /></>
                                                                        : rolesdata.mainmodulesEdit === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                            : rolesdata.mainmodulesEdit === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                : rolesdata.mainmodulesEdit === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                    : <> </>}
                                                                </th>
                                                                <th className='text-center'>
                                                                    {rolesdata.mainmodulesDelete === 0 ? <><Checkbox onChange={onChange} /></>
                                                                        : rolesdata.mainmodulesDelete === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                            : rolesdata.mainmodulesDelete === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                : rolesdata.mainmodulesDelete === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                    : <> </>}
                                                                </th>
                                                            </tr>
                                                        </tbody>
                                                    </>
                                                }
                                                {
                                                    rolesdata.groupmodule == null ? <></> : <>
                                                        <tbody className='roles-group-head'>
                                                            {rolesdata.groupmodule.map((groupmodule, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <th className='tree-view-title'>{groupmodule.groupmodulestitle}</th>
                                                                        <th className='text-center'>
                                                                            {groupmodule.groupmodulesAdd === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : groupmodule.groupmodulesAdd === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : groupmodule.groupmodulesAdd === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : groupmodule.groupmodulesAdd === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                        <th className='text-center'>
                                                                            {groupmodule.groupmodulesView === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : groupmodule.groupmodulesView === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : groupmodule.groupmodulesView === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : groupmodule.groupmodulesView === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                        <th className='text-center'>
                                                                            {groupmodule.groupmodulesEdit === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : groupmodule.groupmodulesEdit === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : groupmodule.groupmodulesEdit === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : groupmodule.groupmodulesEdit === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                        <th className='text-center'>
                                                                            {groupmodule.groupmodulesDelete === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : groupmodule.groupmodulesDelete === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : groupmodule.groupmodulesDelete === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : groupmodule.groupmodulesDelete === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </>
                                                }
                                                {
                                                    rolesdata.submodules == null ? <></> : <>
                                                        <tbody className='roles-group-body'>
                                                            {rolesdata.submodules.map((submodules, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <th className='tree-view-list'><span>{submodules.submodulesname}</span></th>
                                                                        <th className='text-center'>
                                                                            {submodules.submodulesAdd === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : submodules.submodulesAdd === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : submodules.submodulesAdd === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : submodules.submodulesAdd === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                        <th className='text-center'>
                                                                            {submodules.submodulesView === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : submodules.submodulesView === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : submodules.submodulesView === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : submodules.submodulesView === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                        <th className='text-center'>
                                                                            {submodules.submodulesEdit === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : submodules.submodulesEdit === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : submodules.submodulesEdit === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : submodules.submodulesEdit === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                        <th className='text-center'>
                                                                            {submodules.submodulesDelete === 0 ? <><Checkbox onChange={onChange} /></>
                                                                                : submodules.submodulesDelete === 1 ? <><Checkbox onChange={onChange} defaultChecked /></>
                                                                                    : submodules.submodulesDelete === 2 ? <><Checkbox onChange={onChange} disabled /></>
                                                                                        : submodules.submodulesDelete === 3 ? <><Checkbox onChange={onChange} disabled defaultChecked /></>
                                                                                            : <> </>}
                                                                        </th>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </>
                                                }

                                            </>
                                        );
                                    })}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
