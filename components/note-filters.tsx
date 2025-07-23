"use client";

import { useStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Archive, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function NoteFilters() {
  const { filter, setFilter } = useStore();
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
      >
        {t('filter.all')}
      </Button>
      <Button
        variant={filter === "favorites" ? "default" : "outline"}
        onClick={() => setFilter("favorites")}
      >
        <Star className="w-4 h-4 mr-2" />
        {t('filter.favorites')}
      </Button>
      <Button
        variant={filter === "archived" ? "default" : "outline"}
        onClick={() => setFilter("archived")}
      >
        <Archive className="w-4 h-4 mr-2" />
        {t('filter.archived')}
      </Button>
    </div>
  );
}