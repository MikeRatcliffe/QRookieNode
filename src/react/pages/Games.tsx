import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Games.css";

import downloadManager from "@bridge/download";
import gamesManager from "@bridge/games";
import GameCard from "@components/GameCard";
import Icon, { getIconByCaseInsensitiveName, Icons } from "@components/Icons";
import ToggleView from "@components/ToggleView";
import GameDetailsPage from "./GameDetailsPage";
import { CenteredLoading } from "./Loading";

import type { Game } from "@bridge/games";

type SortField = "name" | "lastUpdated" | "size" | "relevance";
type SortOrder = "asc" | "desc";

const Games: React.FC = () => {
  const [result, setResult] = useState<Game[]>(gamesManager.getCache());
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(50);
  const [isGrid, setIsGrid] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getAdbDevices = async () => {
    setLoading(true);

    setResult(await gamesManager.getGames());
    setLoading(false);
  };

  useEffect(() => {
    void getAdbDevices();
  }, []);

  const handleSort = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const filteredAndSortedResults = sortGames(
    result
      .filter(item => {
        if (!search) return true;
        const match = searchItemIsIncluded(search, item);
        // Only include games that have at least one field that contains the entire search term
        return (
          match.relevance > 0 &&
          search.split(" ").some(term =>
            fieldToSearch.some(({ field }) => {
              const value = String(item[field] || "").toLowerCase();
              return value.includes(term.toLowerCase());
            })
          )
        );
      })
      .map(item => ({
        relevance: search ? searchItemIsIncluded(search, item).relevance : 0,
        game: item,
      })),
    sortField,
    sortOrder
  );
  if (result.length > 0 && id) {
    return <GameDetailsPage game={result.find(game => game.id === id)!} />;
  }

  return (
    <>
      <div className="game-list-header">
        <Icon icon={Icons.solid.faSearch} size="xl" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
          placeholder="Search"
        />
        <CenteredLoading visible={result.length === 0 || loading} />
        <ToggleView onToggle={setIsGrid} />
        <strong>Limit:</strong>
        <select onChange={e => setLimit(Number.parseInt(e.target.value))} value={`${limit}`}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="10000">All (Not Recomended)</option>
        </select>
        <button className="dropdown-toggle" type="button" onClick={() => setShowSort(!showSort)}>
          {getSortIcon(sortField, sortOrder)}{" "}
          <Icon
            className="dropdown-icon"
            icon={getIconByCaseInsensitiveName("chevron-down")}
            size="xs"
          />
          {showSort && (
            <>
              <div id="sortdropdown" className="dropdown-menu">
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSort("name", "asc");
                  }}
                >
                  {getSortIcon("name", "asc")}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSort("name", "desc");
                  }}
                >
                  {getSortIcon("name", "desc")}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSort("size", "asc");
                  }}
                >
                  {getSortIcon("size", "asc")}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSort("size", "desc");
                  }}
                >
                  {getSortIcon("size", "desc")}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSort("lastUpdated", "asc");
                  }}
                >
                  {getSortIcon("lastUpdated", "asc")}
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    handleSort("lastUpdated", "desc");
                  }}
                >
                  {getSortIcon("lastUpdated", "desc")}
                </a>
              </div>
            </>
          )}
        </button>
      </div>
      <div className={"game-list" + (isGrid ? "" : " list")}>
        {filteredAndSortedResults
          .filter((_, i) => i < limit)
          .map(item => item.game)
          .map(game => (
            <GameCard
              key={game.id}
              game={game}
              onSelect={game => void navigate(game.id ?? "")}
              onDownload={() => downloadManager.downloadGame(game.id)}
            />
          ))}
      </div>
    </>
  );
};

export default Games;

interface SearchRelevance {
  relevance: number;
  game: Game;
}

const fieldToSearch: { field: keyof Game; weight: number }[] = [
  { field: "name", weight: 10 },
  { field: "normalName", weight: 9 },
  { field: "packageName", weight: 5 },
  { field: "category", weight: 1 },
  { field: "version", weight: 1 },
  { field: "id", weight: 1 },
];

function searchItemIsIncluded(search: string, item: Game): SearchRelevance {
  const searchQuery = search.trim().toLowerCase();
  if (!searchQuery) return { relevance: 0, game: item };

  // Special case: If searching by ID, only match exact ID
  if (item.id.toLowerCase() === searchQuery) {
    return { relevance: 100, game: item }; // Very high relevance for exact ID match
  }

  const searchTerms = searchQuery.split(" ").filter(Boolean);
  const searchPhrase = searchTerms.join(" ");

  // Check if all terms exist in any single searchable field (except ID)
  const hasAllTerms = fieldToSearch
    .filter(({ field }) => field !== "id") // Exclude ID from regular search
    .some(({ field }) => {
      const fieldValue = String(item[field] || "").toLowerCase();
      return searchTerms.every(term => fieldValue.includes(term));
    });

  if (!hasAllTerms) {
    return { relevance: 0, game: item };
  }

  // Calculate relevance score for sorting
  let relevance = 0;

  for (const { field, weight } of fieldToSearch) {
    // Skip ID field in relevance calculation as it's handled specially above
    if (field === "id") continue;

    const fieldValue = item[field];
    if (typeof fieldValue !== "string") continue;

    const fieldValueLower = fieldValue.toLowerCase();

    // Exact match (highest priority)
    if (fieldValueLower === searchQuery) {
      relevance += weight * 10;
      continue;
    }

    // Phrase match (second priority)
    if (fieldValueLower.includes(searchPhrase)) {
      relevance += weight * 7;
      continue;
    }

    // Individual term matches
    const fieldTerms = fieldValueLower.split(" ");
    const termRelevance = searchTerms.reduce((score, term, index) => {
      if (!term) return score;

      const termPos = fieldTerms.indexOf(term);
      if (termPos === -1) return score + (fieldValueLower.includes(term) ? weight : 0);

      // Bonus for terms in the same position as search
      return score + weight * (termPos === index ? 6 : 3);
    }, 0);

    relevance += termRelevance;
  }

  return { relevance, game: item };
}

function sortGames(games: SearchRelevance[], field: SortField, order: SortOrder) {
  return [...games].sort((a, b) => {
    // Special case for relevance since it's not a direct property of Game
    if (field === "relevance") {
      const relevanceCompare =
        order === "asc" ? a.relevance - b.relevance : b.relevance - a.relevance;
      // If relevance is the same, sort alphabetically by game name
      if (relevanceCompare === 0) {
        return a.game.name.localeCompare(b.game.name);
      }
      return relevanceCompare;
    }

    const aValue = a.game[field];
    const bValue = b.game[field];

    if (aValue === bValue) {
      // If the primary sort field is the same, sort by name
      return a.game.name.localeCompare(b.game.name);
    }

    const comparison = aValue! < bValue! ? -1 : 1;
    return order === "asc" ? comparison : -comparison;
  });
}

function getSortIcon(field: SortField, order: SortOrder) {
  switch (field) {
    case "name":
      return (
        <>
          <Icon
            className="dropdown-icon"
            icon={getIconByCaseInsensitiveName(`sort-alpha-${order}`)}
            size="1x"
          />
          {order === "asc" ? "Name" : "Name (decending)"}
        </>
      );
    case "size":
      return (
        <>
          <Icon
            className="dropdown-icon"
            icon={getIconByCaseInsensitiveName(`sort-amount-${order}`)}
            size="1x"
          />
          {order === "asc" ? "Size" : "Size (decending)"}
        </>
      );
    case "lastUpdated":
      return (
        <>
          <Icon
            className="dropdown-icon"
            icon={getIconByCaseInsensitiveName(`sort-amount-${order}`)}
            size="1x"
          />
          {order === "asc" ? "Last Updated" : "Last Updated (decending)"}
        </>
      );
    default:
      return null;
  }
}
