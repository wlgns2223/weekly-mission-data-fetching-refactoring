import { NextPage } from "next";
import { axiosInstance } from "./util/axiosInstance";
import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import { useGetLink } from "./hooks/useGetLink";
import { useGetFolderByLink } from "./hooks/useGetFolderByLink";
import Head from "next/head";
import Modal from "./ui/Modal/Modal";
import Layout from "./feature/Layout";
import AddLink from "./ui/AddLink";
import SearchBar from "./ui/SearchBar";
import Category from "./ui/Category";
import { EditLink } from "./ui/EditLink";
import { CardList } from "./ui/CardList";
import { Card } from "./ui/Card";
import styles from "@/styles/pages/FolderPage.module.css";
import { MappedLink } from "./util/mapFolderFromLink";

export type Folder = {
    id: number;
    created_at: string;
    name: string;
    user_id: number;
    favorite: boolean;
    link: {
        count: number;
    };
};

export type Link = {
    id: number;
    title: string;
    url: string;
    description: string;
    folder_id: number;
    created_at: string;
    updated_at: string;
    image_source: string;
    favorite?: boolean;
};

// export const getStaticPaths = (async () => {
//     const { data } = await axiosInstance.get<{ data: Folder[] }>("users/1/folders");

//     const paths = data.data
//         .map((folder) => folder.id.toString())
//         .map((m) => ({ params: { folderId: [m] } }));

//     return {
//         paths,
//         fallback: true, // false or "blocking"
//     };
// }) satisfies GetStaticPaths;

// export const getStaticProps = (async (context) => {
//     const folderId = context.params?.folderId?.[0];
//     const apiPath = !!folderId ? `users/1/links?folderId=${folderId}` : "users/1/links";
//     const { data } = await axiosInstance.get<{ data: Link[] }>(apiPath);

//     console.log(data);

//     return {
//         props: {
//             links: data.data,
//         },
//     };
// }) satisfies GetStaticProps<any>;

export type FolderPageProps = {
    links: MappedLink[];
    folders: Folder[];
};

const FolderPage: NextPage<FolderPageProps> = (props) => {
    const [currentCategory, setCurrentCategory] = useState("전체");
    const [folderId, setFolderId] = useState("0");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modal, setModal] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [isAddLinkShown, setIsAddLinkShown] = useState(true);
    const [isFooterShown, setIsFooterShown] = useState(false);

    const addLinkRef = useRef(null);
    const footerRef = useRef(null);
    const isAddLinkFixed = !isAddLinkShown && !isFooterShown;

    const links = props.links;
    const folders = props.folders;

    const linkDataWithAll = Array.isArray(folders) ? [{ name: "전체", id: "0" }, ...folders] : [];
    const navFixed = true;

    const handleCategoryClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        const eventTarget = e.target as HTMLElement;
        const category = eventTarget.innerText;
        const Id = eventTarget.getAttribute("data-id");
        setCurrentCategory(category);
        setFolderId(Id || "");
    };

    const handleModalClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        const eventTarget = e.target as HTMLElement;
        e.preventDefault();
        setIsModalOpen(true);
        setModal(e.currentTarget.id);
        setCurrentUrl(eventTarget.getAttribute("data-url") || "");
    };
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleInputClear = () => {
        setSearchTerm("");
    };

    useEffect(() => {
        const addLinkObserver = new IntersectionObserver(
            ([entry]) => {
                setIsAddLinkShown(entry.isIntersecting);
            },
            { threshold: 0 }
        );
        const footerObserver = new IntersectionObserver(
            ([entry]) => {
                setIsFooterShown(entry.isIntersecting);
            },
            { threshold: 0 }
        );
        if (addLinkRef.current) {
            addLinkObserver.observe(addLinkRef.current);
        }
        if (footerRef.current) {
            footerObserver.observe(footerRef.current);
        }

        return () => {
            if (addLinkRef.current) {
                addLinkObserver.unobserve(addLinkRef.current);
            }
            if (footerRef.current) {
                footerObserver.unobserve(footerRef.current);
            }
        };
    }, []);

    const filteredLinks = links?.filter(
        (link) =>
            link.title?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            link.description?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            link.url.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const genHandleDeleteLink = (url: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        const eventTarget = e.target as HTMLElement;
        e.preventDefault();
        setIsModalOpen(true);
        setModal(e.currentTarget.id);
        setCurrentUrl(url);
    };

    return (
        <>
            <Head>
                <title>Folder</title>
            </Head>
            {isModalOpen && (
                <Modal
                    currentCategory={currentCategory}
                    modal={modal}
                    setIsModalOpen={setIsModalOpen}
                    categoryData={folders}
                    currentUrl={currentUrl}
                    selectedId={+folderId}
                />
            )}
            <Layout isNavFixed={navFixed} footerRef={footerRef}>
                <div className={styles.FolderPage}>
                    <AddLink addLinkRef={addLinkRef} />
                    <div className={styles.FolderPageItems}>
                        <SearchBar
                            handleInputChange={handleInputChange}
                            handleInputClear={handleInputClear}
                            searchTerm={searchTerm}
                        />
                        <Category
                            buttonClicked={handleCategoryClick}
                            linkData={linkDataWithAll}
                            currentCategory={currentCategory}
                            handleModalClick={handleModalClick}
                        />
                        <EditLink
                            currentCategory={currentCategory}
                            handleEditClick={handleModalClick}
                        />
                        {filteredLinks && filteredLinks.length > 0 ? (
                            <CardList>
                                {filteredLinks?.map((link) => {
                                    const handleDeleteLink = genHandleDeleteLink(link.url);

                                    return (
                                        <Card
                                            key={link?.id}
                                            {...link}
                                            handleModalClick={handleModalClick}
                                        />
                                    );
                                })}
                            </CardList>
                        ) : (
                            <div className={styles.NoLink}>저장된 링크가 없습니다.</div>
                        )}
                        <button className={styles.mobileAddButton}>폴더 추가하기 +</button>
                        {isAddLinkFixed && <AddLink isAddLinkFixed={isAddLinkFixed} />}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default FolderPage;
