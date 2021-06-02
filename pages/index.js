import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Octokit } from "@octokit/core";
import { useRef } from "react";

export default function Home(props) {
  const selectEl = useRef(null);

  async function handleClick() {
    try {
      const username = selectEl.current.value;

      const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN,
      });

      await octokit.request("DELETE /orgs/{org}/memberships/{username}", {
        org: process.env.NEXT_PUBLIC_GITHUB_ORG,
        username,
      });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Desligamento de funcionario</title>
        <meta name="description" content="Desligamento de funcionario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Desligamento de funcionario (GITHUB)</h1>

        <select name={"member-to-dissolution"} ref={selectEl}>
          {props.members.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
          ;
        </select>

        <button type="button" onClick={handleClick}>
          Desligar
        </button>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN,
  });

  const response = await octokit.request("GET /orgs/{org}/members", {
    org: process.env.NEXT_PUBLIC_GITHUB_ORG,
    per_page: 100,
  });
  const members = [];

  await response.data.forEach((member) => {
    members.push(member.login);
  });

  return {
    props: { members },
  };
};
