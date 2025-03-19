import { Breadcrumb, Button, Form, Select, Input, Checkbox, ConfigProvider } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OverlayMenuDropdown } from '../../../shared-components/overlay-menu/overlay-menu';
import { ZinDeleteIcon, ZinEditIcon, ZinlistviewEdit, ZinRightArrow, ZinSolidUsers } from '../../images';

export const UserRolesAdd = (props) => {

    const [checkedAll, setCheckedAll] = useState(false);
    const [checked, setChecked] = useState({
        nr1: false,
        nr2: false,
        nr3: false,
        nr4: false,
        nr5: false
    });

    const toggleCheck = (inputName) => {
        setChecked((prevState) => {
            const newState = { ...prevState };
            newState[inputName] = !prevState[inputName];
            return newState;
        });
    };

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

    const validateMessages = {
        required: 'Mandatory field.',                                                               // Common error message for required fields
    };

    return (
        <div className='edit-company-information'>
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
                        Create custom role
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className='common-SpaceAdmin'>
                <div className='zn-admin-Card '>
                    <ConfigProvider getPopupContainer={(triggerNode) => triggerNode?.parentNode}>
                        <Form
                            className="add-form"
                            autoCorrect="off"
                            autoCapitalize="off"
                            autoComplete="off"
                            layout="vertical"
                            name="nest-messages"
                            validateTrigger='onBlur'
                            scrollToFirstError={true}
                            validateMessages={validateMessages}
                        >
                            <div className='zn-card-body mb-5 p-4'>
                                <div className='row'>
                                    <div className='col-lg-11'>
                                        <div className='row'>
                                            <div className='col-lg-4'>
                                                <div className='zn-light-primary-color zn-fs-s zn-fw-500'>
                                                    Add user role
                                                </div>
                                                <div>
                                                    Create a user role with custom permissions
                                                </div>
                                            </div>
                                            <div className='col-lg-4'>
                                                <Form.Item required label="Import Permisions" className='mb-3'>
                                                    <Select
                                                        size='large'
                                                        showSearch
                                                        placeholder="Select Import Permisions"
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                        }
                                                        options={[
                                                            {
                                                                value: '1',
                                                                label: 'Recruiter',
                                                            },
                                                            {
                                                                value: '2',
                                                                label: 'Lead recruiter',
                                                            },
                                                            {
                                                                value: '3',
                                                                label: 'Manager',
                                                            },
                                                            {
                                                                value: '4',
                                                                label: 'Talent Acquisition executive',
                                                            },
                                                            {
                                                                value: '5',
                                                                label: 'Management',
                                                            },
                                                            {
                                                                value: '6',
                                                                label: 'Admin',
                                                            },
                                                        ]}
                                                    />
                                                    <span className='zn-light-primary-color zn-fs-xs'> * Begin with an existing permissions template and edit.</span>
                                                </Form.Item>
                                            </div>
                                            <div className='col-lg-4'>
                                                <Form.Item label="Role name" className='mb-3'>
                                                    <Input type='text' size='large' placeholder="Enter Role name" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className='roles-active-sec'>
                                            <div className='table-responsive'>
                                                <table className='col-md-10 roles-active-table'>
                                                    <thead >
                                                        <tr>
                                                            <th>Modules</th>
                                                            <th className='text-center'>Add</th>
                                                            <th className='text-center'>View</th>
                                                            <th className='text-center'>Edit</th>
                                                            <th className='text-center'>Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        <tr>
                                                            <th>jobs</th>
                                                            <th className='text-center'><Checkbox /> </th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                        <tr>
                                                            <th>Candidates</th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                    </tbody>
                                                    <tbody className='roles-group-head roles-group-body'>
                                                        <tr>
                                                            <th className='tree-view-title'>
                                                                <span>
                                                                    Networks
                                                                </span>
                                                            </th>
                                                            <td className='text-center'> <Checkbox
                                                                onChange={(event) => selectAll(event.target.checked)}
                                                                checked={checkedAll}
                                                            /></td>
                                                            <td className='text-center'><Checkbox /></td>
                                                            <td className='text-center'><Checkbox /></td>
                                                            <td className='text-center'><Checkbox /></td>
                                                        </tr>
                                                        <tr>
                                                            <th className='tree-view-list'>
                                                                <span>
                                                                    Vendors
                                                                </span>
                                                            </th>
                                                            <th className='text-center'>
                                                                <Checkbox
                                                                    name="nr1"
                                                                    onChange={() => toggleCheck("nr1")}
                                                                    checked={checked["nr1"]}
                                                                /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                        <tr>
                                                            <td className='tree-view-list'>
                                                                <span>
                                                                    Mail List
                                                                </span>
                                                            </td>
                                                            <th className='text-center'>
                                                                <Checkbox
                                                                    name="nr2"
                                                                    onChange={() => toggleCheck("nr2")}
                                                                    checked={checked["nr2"]}
                                                                />
                                                            </th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                        <tr>
                                                            <th className='tree-view-list'>
                                                                <span>
                                                                    Clients
                                                                </span>
                                                            </th>
                                                            <th className='text-center'>
                                                                <Checkbox
                                                                    name="nr3"
                                                                    onChange={() => toggleCheck("nr3")}
                                                                    checked={checked["nr3"]}
                                                                />
                                                            </th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                        <tr>
                                                            <th className='tree-view-list'>
                                                                <span>
                                                                    Hotlist
                                                                </span>
                                                            </th>
                                                            <th className='text-center'>
                                                                <Checkbox
                                                                    name="nr4"
                                                                    onChange={() => toggleCheck("nr4")}
                                                                    checked={checked["nr4"]}
                                                                />
                                                            </th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                        <tr>
                                                            <th className='tree-view-list'>
                                                                <span>
                                                                    Candidate Groups
                                                                </span>
                                                            </th>
                                                            <th className='text-center'>
                                                                <Checkbox
                                                                    name="nr5"
                                                                    onChange={() => toggleCheck("nr5")}
                                                                    checked={checked["nr5"]}
                                                                />
                                                            </th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                            <th className='text-center'><Checkbox /></th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white add-form-footer d-flex align-items-center justify-content-end gap-3'>
                                <Button className='zn-fw-500 zn-fs-s zn-light-primary-color' size="small" type="secondary">
                                    <Link to='/app/admin/usersettings/roles'>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button className='zn-fw-500 zn-fs-s' size="small" type="primary" >
                                    Save</Button>
                            </div>
                        </Form>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}
