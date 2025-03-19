import React from "react";
import { Breadcrumb, Form, Input } from 'antd';
import AdminMenus from "../../components/admin-menus/admin-menus";
import { ZinRightArrow, ZinSearch } from "../../components/images";
import { Link } from "react-router-dom";
import '../../global-style.scss';

export const Admin = () => {
    return (
        <>
            <div className='admin-breadcrums '>
                <div className="d-flex w-100 justify-content-between align-items-center">
                    <Breadcrumb separator={<ZinRightArrow />} >
                        <Breadcrumb.Item >
                            <Link to='/app/dashboard'>
                                Home
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Admin
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                        <Form
                            className='search-toolset'
                            layout='vertical'
                            autoCorrect='off'
                            autoCapitalize='off'
                            autoComplete='off'
                        // form={hotlistSearchForm}
                        // onFinish={onFinishhotlistSearch}
                        >
                            <ZinSearch />
                            <div className="purple-border"></div>
                            <Form.Item
                                className="mb-0"
                                name='searchValue'
                                rules={[
                                    {
                                        min: 3,
                                        message: 'Minimum 3 character'
                                    },
                                    {
                                        required: true,
                                        message: '',
                                    }
                                ]}
                            >
                                <Input
                                    // ref={inputFocusElement}
                                    placeholder="Search admin"
                                    // value={hotlistSearchValue}
                                    // onChange={hotlistSearchOnChange}
                                    // suffix={
                                    //     hotlistSearchValue.length >= 3 && (
                                    //         <ZinClear
                                    //             // onClick={() => { clearFunc() }}
                                    //             style={{ color: 'rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
                                    //         />
                                    //     )
                                    // }
                                    // disabled={onClickFilterSearchDisabled}
                                    autoFocus
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="admin-Layout">
                <div className='menus-body'>
                    <AdminMenus />
                </div>
            </div>
        </>

    )
};
