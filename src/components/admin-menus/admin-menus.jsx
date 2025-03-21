import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ZinAppIntegrationIcon, ZinAskQuestionIcon, ZinCandidateBlacklistIcon, ZinCandidateDocumentsIcon, ZinCandidateDomainIcon, ZinCandidateGroupsIcon, ZinCandidateRatingsIcon, ZinCandidateRejectionIcon, ZinCandidateResponseIcon, ZinCandidateSkillsIcon, ZinCandidateSourcesIcon, ZinCandidateStatusIcon, ZinClearIcon, ZinClientInfoIcon, ZinCompanyInfo, ZinCompanyInfoIcon, ZinCurrentSubscriptionIcon, ZinCustomNotificationIcon, ZinGiveSuggestionIcon, ZinHistoryIcon, ZinJobRemoteStatusIcon, ZinJobSourceIcon, ZinJobTagsIcon, ZinOrgLocation, ZinOrgLocationIcon, ZinPaymentInfoIcon, ZinPaymentInvoiceIcon, ZinSearch, ZinSignatureIcon, ZinSubmissionIcon, ZinTeamsIcon, ZinUserLimitIcon, ZinUserRoleIcon, ZinUsersIcon, ZinVoiceConcernIcon } from "../images";

export default function AdminMenus(props) {
    const [search, setNewSearch] = useState("");
    const [isSearchActive, setIsSearchActive] = React.useState(false);
    const inputElement = useRef();

    const people = [
        {
            key: 1,
            maintitle: 'Settings',
            mainmenu: [
                {
                    subtitle: 'Organization Settings',
                    label: [
                        {
                            key: 'company-information',
                            labelname: 'Company Information',
                            icon: <ZinCompanyInfoIcon />,
                        },
                        {
                            key: 'location',
                            labelname: 'Location',
                            icon: <ZinOrgLocationIcon />,
                        }
                    ]
                },
                {
                    subtitle: 'User Settings',
                    label: [
                        {
                            key: 'usersettings/user',
                            labelname: 'Users',
                            icon: <ZinUsersIcon />,
                        },
                        {
                            key: 'usersettings/teams',
                            labelname: 'Teams',
                            icon: <ZinTeamsIcon />,
                        },
                        {
                            key: 'usersettings/roles',
                            labelname: 'Roles',
                            icon: <ZinUserRoleIcon />
                        },
                        // {
                        //     key: 'usersettings/user-limits',
                        //     labelname: 'User Limits',
                        //     icon: <ZinUserLimitIcon />,
                        // },
                        // {
                        //     key: 'usersettings/hierarchy',
                        //     labelname: 'Hierarchy',
                        //     icon: <ZinUserLimitIcon />,
                        // },

                    ]
                },
            ]
        },
        {
            key: 2,
            maintitle: 'Clients',
            mainmenu: [
                {
                    subtitle: 'Settings',
                    label: [
                        {
                            key: 'clients',
                            labelname: 'Clients',
                            icon: <ZinClientInfoIcon />,
                        }
                    ]
                },
            ]
        },
        {
            key: 3,
            maintitle: 'Master',
            mainmenu: [
                {
                    subtitle: 'Jobs',
                    label: [
                        {
                            key: 'jobs/sources',
                            labelname: 'Sources',
                            icon: <ZinJobSourceIcon />,
                        },
                        {
                            key: 'jobs/remote-status',
                            labelname: 'Remote status',
                            icon: <ZinJobRemoteStatusIcon />,
                        },
                        {
                            key: 'jobs/employment-type',
                            labelname: 'Employment type',
                            icon: <ZinJobRemoteStatusIcon />,
                        },
                        {
                            key: 'jobs/tags',
                            labelname: 'Tags',
                            icon: <ZinJobTagsIcon />,
                        },
                        {
                            key: 'jobs/tax-terms',
                            labelname: 'Tax terms',
                            icon: <ZinJobRemoteStatusIcon />,
                        },
                    ]
                },
                {
                    subtitle: 'Candidates',
                    label: [
                        {
                            key: 'candidates/sources',
                            labelname: 'Sources',
                            icon: <ZinCandidateSourcesIcon />,
                        },
                        {
                            key: 'candidates/status',
                            labelname: 'Status',
                            icon: <ZinCandidateStatusIcon />,
                        },
                        {
                            key: 'candidates/rejection-reasons',
                            labelname: 'Rejection reasons',
                            icon: <ZinCandidateRejectionIcon />,
                        },
                        {
                            key: 'candidates/blacklist-type',
                            labelname: 'Blacklist types',
                            icon: <ZinCandidateBlacklistIcon />,
                        },
                        {
                            key: 'candidates/response-type',
                            labelname: 'Response type',
                            icon: <ZinCandidateResponseIcon />,
                        },
                        {
                            key: 'candidates/skills',
                            labelname: 'Skills',
                            icon: <ZinCandidateSkillsIcon />,
                        },
                        {
                            key: 'candidates/domain',
                            labelname: 'Domain',
                            icon: <ZinCandidateDomainIcon />,
                        },
                        // {
                        //     key: 'candidates/rating',
                        //     labelname: 'Rating',
                        //     icon: <ZinCandidateRatingsIcon />,
                        // },
                        {
                            key: 'candidates/work-authorization',
                            labelname: 'Work Authorization',
                            icon: <ZinCandidateRatingsIcon />,
                        },
                        {
                            key: 'candidates/groups',
                            labelname: 'Groups',
                            icon: <ZinCandidateGroupsIcon />,
                        },
                        {
                            key: 'candidates/tags',
                            labelname: 'Tags',
                            icon: <ZinCandidateGroupsIcon />,
                        },

                    ]
                },
                {
                    subtitle: 'Submissions',
                    label: [
                        {
                            key: 'submissions/status',
                            labelname: 'Status',
                            icon: <ZinSubmissionIcon />,
                        },

                    ]
                },
            ]
        }
    ]

    const handleSearchChange = (e) => {
        setNewSearch(e.target.value);
    };

    const filtered = !search
        ? people
        : people.filter((person) =>
            person.maintitle.toLowerCase().includes(search.toLowerCase())
        )

    const searchClose = () => {
        setIsSearchActive(false);
    };

    const searchOpen = () => {
        setIsSearchActive(true);
        inputElement.current.focus();
    };
    return (
        <>
            {filtered.map((person, key) => {
                let subtitled1 = person.mainmenu;
                return (
                    <div key={key} className='card border-0 mb-2'>
                        <div className='card-body admin-menu'>
                            <div className='admin-menu-header zn-light-text-dark-color zn-fs-m'>
                                {person.maintitle}
                            </div>
                            <hr className='zn-light-text-dark02-color' />
                            {subtitled1.map((mainmenu, i) => {
                                return (
                                    <>
                                        <div className='admin-menu-sub-header zn-light-primary-color  zn-fs-s mb-3'>
                                            {mainmenu.subtitle}
                                        </div>
                                        <div className='row mb-3'>
                                            {mainmenu.label.map((label, i, key) => {
                                                return (
                                                    <div key={i} className='col-xxl-2 col-lg-3 col-md-4 col-sm-6'>
                                                        <Link to={`/app/admin/${label.key}`} title={label.labelname}>
                                                            <div className='admin-menu-items d-flex align-items-center mb-3' >
                                                                <div style={{ width: "25px", marginRight: "10px", backgroundColor: "rgb(243, 246, 248)", padding: "8px 20px" }}>
                                                                    <div style={{ marginLeft: "-14px" }}>
                                                                        {label.icon}
                                                                    </div>
                                                                </div>
                                                                <span className='zn-fs-s text-truncate zn-light-text-dark02-color'>{label.labelname}</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
};
