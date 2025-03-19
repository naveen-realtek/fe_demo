import { Breadcrumb, Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { OverlayMenuDropdown } from '../../../shared-components/overlay-menu/overlay-menu';
import { ZinDeleteIcon, ZinEditIcon, ZinlistviewEdit, ZinRightArrow, ZinSolidUsers } from '../../images';

export const UserRoles = (props) => {

    const roledata = [
        {
            key: 'admin',
            rolename: 'Admin',
            roledesc: 'Manages organization data and create custom workflow, can access all modules.',
            roleusericon: <ZinSolidUsers />,
            noofmembers: '01',
        },
        {
            key: 'manager',
            rolename: 'Manager',
            roledesc: 'Manages a team of recrutiers, assess jobs and approves profiles submitted to client.',
            roleusericon: <ZinSolidUsers />,
            noofmembers: '05',
        },
        {
            key: 'lead-recruiter',
            rolename: 'Lead Recruiter',
            roledesc: 'Source, screen and submit profiles for an job, assign jobs and guide a team of recruiters.',
            roleusericon: <ZinSolidUsers />,
            noofmembers: '05',
        },
        {
            key: 'recruiter',
            rolename: 'Recruiter',
            roledesc: 'Source, screen and submit profiles for an job.  ',
            roleusericon: <ZinSolidUsers />,
            noofmembers: '05',
        },
        {
            key: 'talent-acquisition-executive',
            rolename: 'Talent Acquisition Executive',
            roledesc: 'Takes care of proactive recuitment, creating and managing a talent pool.  ',
            roleusericon: <ZinSolidUsers />,
            noofmembers: '05',
        },
        {
            key: 'management',
            rolename: 'Management',
            roledesc: 'Generate and view reports.',
            roleusericon: <ZinSolidUsers />,
            noofmembers: '05',
        },
    ]

    const customroledata = [
        {
            key: 'senior-recruiter',
            rolename: 'Senior recruiter',
            roledesc: 'Permissions imported from ‘Lead recruiter’ role.',
            roledeleteicon: <ZinDeleteIcon />,
            roleediticon: <ZinEditIcon />,
            roleusericon: <ZinSolidUsers />,
            noofmembers: '01',
        },
    ]
    return (
        <div className='user-roles-page'>
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
                    <Breadcrumb.Item>Roles</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className='common-SpaceAdmin'>
                <div className='zn-card'>
                    <div className=''>
                        <div className='zn-fs-m zn-fw-700 mb-2'>
                            Zinnext Default
                        </div>
                        <div className='roles-list mb-4' >
                            <ul>
                                {roledata.map((roledata, i) => {
                                    return (
                                        <li key={i}>
                                            <Link to={roledata.key}>
                                                <div className='d-flex justify-content-between p-3 roles-list-item zn-fs-s mb-2'>
                                                    <div className='me-3'>
                                                        <div className=' zn-light-primary-color'>
                                                            {roledata.rolename}
                                                        </div>
                                                        <div className='zn-light-text-dark-color'>
                                                            {roledata.roledesc}
                                                        </div>
                                                    </div>
                                                    <div className='align-self-center zn-light-text-dark-color d-flex'>
                                                        {roledata.roleusericon}&nbsp;&nbsp;{roledata.noofmembers}
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className='coustom-roles_list mb-3'>
                            <div className='d-flex justify-content-between mb-2'>
                                <div className='zn-fs-m zn-fw-700'>
                                    Custom user roles
                                </div>
                                <div>
                                    <Button type="primary" size='small'>
                                        <Link to='/app/admin/usersettings/roles/add'>Add</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='roles-list mb-4' >
                            <ul>
                                {customroledata.map((customroledata, i) => {
                                    return (
                                        <li key={i}>
                                            <div className='d-flex justify-content-between p-3 roles-list-item zn-fs-s mb-2'>
                                                <Link to={customroledata.key}>
                                                    <div className='me-3'>
                                                        <div className=' zn-light-primary-color'>
                                                            {customroledata.rolename}
                                                        </div>
                                                        <div className='zn-light-text-dark-color'>
                                                            {customroledata.roledesc}
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className='align-self-center zn-light-text-dark-color d-flex'>
                                                    <div className='me-4'>
                                                        {customroledata.roledeleteicon}
                                                    </div>
                                                    <div className='me-4'>
                                                        {customroledata.roleediticon}
                                                    </div>
                                                    <div>
                                                        {customroledata.roleusericon}&nbsp;&nbsp;{customroledata.noofmembers}
                                                    </div>
                                                </div>
                                            </div>

                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
