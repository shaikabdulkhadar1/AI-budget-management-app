# AI-budget-management-app

# 📱 AI Budget Tracker — Documentation

> A cross-platform mobile app built with **React Native** and powered by **Gemini 2.5 Flash** for AI insights that help users track spending, manage budgets, and gain personalized financial recommendations.

---

## 🚀 Overview

**AI Budget Tracker** is a smart personal finance app that lets users:

- Track income and expenses
- Set and manage budgets
- Get AI-generated spending insights
- Predict future financial behavior
- Extract data from receipts via OCR

The goal is to help users **understand and optimize their spending habits** through intelligent automation and meaningful visualizations.

![App Preview](/ai-app-overview.png)

---

## 📦 Features

### 🔐 Authentication

- Sign up / login with Email and Google
- JWT-based secure session handling
- Optional biometric login (Face ID / Touch ID)

### 💸 Expense Management

- Add income and expenses with category tags
- View history with filters (day, week, month)
- Attach receipts or notes

### 🎯 Budget Planning

- Set budgets per category
- Real-time alerts on budget limits
- Visual budget usage tracking

### 📊 Analytics & Reports

- Pie charts of spending per category
- Monthly/weekly bar charts
- Daily/weekly/monthly breakdowns

### 🤖 AI-Powered Insights (Gemini 2.5 Flash)

- Personalized financial advice
- Natural language expense input
- Spending pattern analysis
- Alerts on irregular activity
- Predictive budgeting suggestions

### 📸 Receipt Scanner (Optional)

- OCR to extract amount, date, and vendor from image
- Auto-fills expense form

---

## ⚙️ Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| **Frontend**   | React Native (Expo), TypeScript         |
| **Backend**    | Node.js, Express.js, MongoDB / Firebase |
| **AI Engine**  | Gemini 2.5 Flash (via REST API)         |
| **OCR**        | Google Cloud Vision API or Tesseract    |
| **State Mgmt** | Redux Toolkit or Context API            |
| **Charting**   | Victory Native / Recharts               |

---

## 🧠 AI Integration (Gemini 2.5 Flash)

### Use Cases:

| Feature               | Prompt to Gemini                                             |
| --------------------- | ------------------------------------------------------------ |
| Personalized Insights | “Analyze the user’s spending and give suggestions”           |
| NLP Parsing           | “Extract structured data from: 'Bought coffee for $5 today'” |
| Prediction            | “Based on the data, what will user spend next month?”        |
| Alerts                | “Is there a spending spike this month?”                      |

### Integration Flow:

1. Frontend sends structured user data (spending history)
2. Backend hits Gemini API with a custom prompt
3. Response is processed and displayed to the user

---

## 🗂 Folder Structure

```
budget-tracker-ai/
├── frontend/          # React Native app (Expo)
│   ├── components/
│   ├── screens/
│   ├── context/ or redux/
│   ├── ai/            # Gemini API integration
│   └── App.tsx
├── backend/           # Node.js Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ai/            # Gemini interaction logic
├── README.md
```

---

## 🧪 Testing

### Development Testing

- iOS Simulator via Xcode
- Android Emulator via Android Studio
- Expo Go App (on real device)
- Web Preview (`npx expo start --web`)

### API Testing

- Postman / Thunder Client
- Jest (for backend routes)
- Cypress / Detox (optional UI tests)

---

## 📤 Deployment

### Google Play Store

- Configure `android.package` in `app.json`
- Run `npx expo build:android`
- Upload `.aab` to Google Play Console

### Apple App Store

- Requires Apple Developer Account ($99/year)
- Configure `ios.bundleIdentifier`
- Run `npx expo build:ios`
- Upload using Transporter app or EAS Submit

---

## 🔒 Security Considerations

- JWT authentication with refresh tokens
- Secure Gemini API key handling (env vars)
- Encrypted local storage (AsyncStorage or SecureStore)
- Input validation and backend rate limiting

---

## 📌 Future Enhancements

- Smart investment suggestions
- Social expense tracking with friends/family
- Gamified savings goals
- Cloud sync and backup
- Dark mode and themes

---

## 🙌 Credits

- **AI Engine**: [Gemini 2.5 Flash](https://ai.google.dev/)
- **Mobile Framework**: React Native via Expo
- **Backend**: Node.js + Express
- **Design Inspiration**: Figma Community templates
