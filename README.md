# Pixel Pry

Welcome to Pixel Pry, a project developed by Team TechNexus!

## Introduction

Pixel Pry is a web application that allows users to upload images and retrieve them using a custom URL structure. Additionally, the project features Tesseract OCR integration to extract text content from uploaded images, storing captions in a MongoDB database. The user interface includes a fuzzy search feature, enabling users to search for images based on their content.

## Key Features

- **Custom URL Structure**: Users can retrieve uploaded images using a custom URL format: `<our-domain-name>/<your-email>/<folder>/<image-name>`.
- **Tesseract OCR Integration**: Text content from uploaded images is extracted using Tesseract OCR.
- **MongoDB Integration**: Captions extracted from images are stored in a MongoDB database.
- **Fuzzy Search**: The user interface includes a fuzzy search feature, allowing users to search for images based on their content.

## Technologies Used

- **NEXT.js 14**: A React framework for building server-side rendered and statically generated web applications.
- **Express.js**: A Node.js web application framework used for building APIs and web servers.
- **Tesseract OCR**: An optical character recognition engine for extracting text from images.
- **MongoDB**: A NoSQL database used for storing image captions.
- **Fuzzy Search Algorithm**: Implemented in the user interface to enable searching for images based on their content.

## Getting Started

1. **Clone the Repository**: Clone the Pixel Pry repository to your local machine.
   ```
   git clone https://github.com/your-username/pixel-pry.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install dependencies.
   ```
   cd pixel-pry
   npm install
   ```

3. **Set Up MongoDB**: Ensure MongoDB is installed and running on your system. Update the MongoDB connection string in the project configuration files if necessary.

4. **Start the Development Server**: Run the following command to start the development server.
   ```
   npm run dev
   ```

5. **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to access Pixel Pry.

## Contribution Guidelines

We welcome contributions from the community to enhance Pixel Pry. If you'd like to contribute, please follow these guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Make your changes and ensure they align with the project's coding standards.
- Test your changes thoroughly.
- Submit a pull request describing the changes you've made and any relevant information.


---

Happy coding!
