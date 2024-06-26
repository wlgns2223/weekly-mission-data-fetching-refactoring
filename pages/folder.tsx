import AddLink from "@/src/ui/AddLink";
import Layout from "@/src/feature/Layout";
import SearchBar from "@/src/ui/SearchBar";
import { CardList } from "@/src/ui/CardList";
import { Card } from "@/src/ui/Card";
import { useGetLink } from "@/src/hooks/useGetLink";
import { useGetFolderByLink } from "@/src/hooks/useGetFolderByLink";
import Category from "@/src/ui/Category";
import { EditLink } from "@/src/ui/EditLink";
import Modal from "@/src/ui/Modal/Modal";

import styles from "@/styles/pages/FolderPage.module.css";
import { useState, useRef, useEffect, ChangeEventHandler, MouseEventHandler } from "react";
import Head from "next/head";

const FolderPage: React.FC = () => {
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

    const { data: linkData } = useGetLink();
    const { folderData } = useGetFolderByLink(folderId);
    const links = folderData?.data;

    const linkDataWithAll = Array.isArray(linkData) ? [{ name: "전체", id: "0" }, ...linkData] : [];
    const navFixed = true;

    const handleCategoryClick: MouseEventHandler<HTMLButtonElement> = (e) => {
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
                    categoryData={linkData}
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
