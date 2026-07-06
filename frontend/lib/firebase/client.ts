"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { config } from "@/lib/config";

const app = getApps().length ? getApps()[0] : initializeApp(config.firebase);

export const auth = getAuth(app);
