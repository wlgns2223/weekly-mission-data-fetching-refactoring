import FolderInfo from "@/src/ui/FolderInfo";
import SearchBar from "@/src/ui/SearchBar";
import { CardList } from "@/src/ui/CardList";
import Layout from "@/src/feature/Layout";
import { Card } from "@/src/ui/Card";
import { useGetFolder } from "@/src/hooks/useGetFolder";
import styles from "@/styles/pages/SharedPage.module.css";
import { ChangeEventHandler, useState } from "react";
import Head from "next/head";

const SharedPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useGetFolder();
  const { profileImage, ownerName, folderName, links } = data || {};

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleInputClear = () => {
    setSearchTerm("");
  };

  const filteredLinks = links?.filter(
    (link) =>
      link.alt?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      link.description
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <>
      <Head>
        <title>Shared</title>
      </Head>
      <Layout>
        <div className={styles.SharedPage}>
          <FolderInfo
            profileImage={profileImage}
            ownerName={ownerName}
            folderName={folderName}
          />
          <div className={styles.SharedPageItems}>
            <SearchBar
              handleInputChange={handleInputChange}
              handleInputClear={handleInputClear}
              searchTerm={searchTerm}
            />
            <CardList>
              {filteredLinks?.map((link) => <Card key={link?.id} {...link} />)}
            </CardList>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SharedPage;
