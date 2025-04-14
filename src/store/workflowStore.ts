import { create } from 'zustand';
import { WorkflowState, WorkflowNode, WorkflowEdge } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowStore extends WorkflowState {
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (edgeId: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
}

// Define the hardcoded node
const propertyExtractorNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 250, y: 150 }, // Example position
  data: {
    label: 'PropertyDataExtractor',
    content: 'Get core details about a specific property from Zillow.',
    metadata: {
      inputs: ['Property Address'],
      context: `Tool/Action: (Simulated) Call Zillow API for the address.\nLLM Task: Extract key info and structure it.\nSystem Message: "You are an expert real estate data extractor. You access Zillow data and output only a clean JSON object."\nOutput Format Instruction: "Extract Property Type, Price, Bed/Bath, SqFt, Year Built, Lot Size, Tax History (last 3 years), Price History (last 3 sales). Output only a JSON with keys: property_type, current_price, bedrooms, bathrooms, square_footage, year_built, lot_size_sqft, tax_history, price_history."`,
      model: 'gpt-4o',
      temperature: 0.2,
      topP: 1.0,
      dataSource: {
        type: 'api',
        apiEndpoint: 'https://api.zillow.com/fake/property-details'
      },
      additionalInput: `Property Details:
Type: Single Family
Current Price: $750,000
Bed/Bath: 4 beds / 3 baths
Square Footage: 2,500 sqft
Year Built: 1995
Lot Size: 8,750 sqft

Tax History:
- 2023: $9,500
- 2022: $9,200
- 2021: $9,000

Price History (Last 3 Sales):
- 2020-05-15: $650,000
- 2015-10-20: $500,000
- 2010-03-01: $400,000`
    }
  }
};

// Define the second hardcoded node
const demographicsExtractorNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 250, y: 400 }, // Position below the first node
  data: {
    label: 'DemographicsDataExtractor',
    content: 'Get key demographic info about the property\'s neighborhood from Census data.',
    metadata: {
      inputs: ['Property Address'],
      context: `Tool/Action: (Simulated) Call US Census API for the area.
LLM Task: Extract key info and structure it.
System Message: "You are an expert demographic data extractor. You access US Census data for a specific area and output only a clean JSON object."
Output Format Instruction: "For the area containing the property, extract Median Household Income, Education Levels (% Bachelor's+), Racial/Ethnic Makeup (top 3 groups %), Average Household Size, Owner-Occupied vs Renter-Occupied Housing %. Output only a JSON with keys: median_income, education_bachelors_plus_pct, ethnicity_top3_pct, avg_household_size, housing_owner_occupied_pct."`, 
      model: 'gpt-4o',
      temperature: 0.2,
      topP: 1.0,
      dataSource: { 
        type: 'api',
        apiEndpoint: 'https://api.census.gov/fake/demographics'
      },
      // Realistic, user-facing text output
      additionalInput: `Neighborhood Demographics:
Median Household Income: $85,000
Education (Bachelor's+): 45%
Ethnicity (Top 3):
  - White: 60%
  - Hispanic: 25%
  - Asian: 10%
Average Household Size: 2.6
Owner-Occupied Housing: 65%`
    }
  }
};

// Define the third hardcoded node
const dataConsolidatorNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 600, y: 275 }, // Position to the right, between the first two
  data: {
    label: 'DataConsolidator',
    content: 'Combine the structured property and demographic data.',
    metadata: {
      // Inputs conceptually refer to the JSON outputs of the previous nodes
      inputs: ['PropertyDataExtractor Output', 'DemographicsDataExtractor Output'], 
      context: `Tool/Action: None (purely data structuring).
LLM Task: Merge the two JSON inputs cleanly.
System Message: "You are a data organizer. Combine the provided JSON inputs precisely."
Output Format Instruction: "Combine the Property Data JSON and Demographics Data JSON into a single JSON object. The final object should have two top-level keys: property_details (containing the data from Node 1) and area_demographics (containing the data from Node 2). Output only the combined JSON."`, 
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
      topP: 1.0,
      dataSource: { type: 'none' }, // No external data source
      // Realistic, combined JSON output (as a string)
      additionalInput: JSON.stringify({
        "property_details": {
          "property_type": "Single Family",
          "current_price": 750000,
          "bedrooms": 4,
          "bathrooms": 3,
          "square_footage": 2500,
          "year_built": 1995,
          "lot_size_sqft": 8750,
          "tax_history": [
            { "year": 2023, "amount": 9500 },
            { "year": 2022, "amount": 9200 },
            { "year": 2021, "amount": 9000 }
          ],
          "price_history": [
            { "date": "2020-05-15", "price": 650000 },
            { "date": "2015-10-20", "price": 500000 },
            { "date": "2010-03-01", "price": 400000 }
          ]
        },
        "area_demographics": {
          "median_income": 85000,
          "education_bachelors_plus_pct": 45,
          "ethnicity_top3_pct": [
            { "group": "White", "pct": 60 },
            { "group": "Hispanic", "pct": 25 },
            { "group": "Asian", "pct": 10 }
          ],
          "avg_household_size": 2.6,
          "housing_owner_occupied_pct": 65
        }
      }, null, 2) // Stringify with indentation
    }
  }
};

// --- Level 2 Nodes (Analysis & Content Creation) ---

// Node 4: Market Opportunity Analyzer
const marketAnalyzerNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 950, y: 100 }, // Position further right
  data: {
    label: 'MarketOpportunityAnalyzer',
    content: 'Analyze combined data for marketing angles & target buyers.',
    metadata: {
      inputs: ['DataConsolidator Output'], 
      context: `Tool/Action: None (pure reasoning).
LLM Task: Interpret the data and generate strategic insights.
System Message: "You are an expert real estate market analyst and marketing strategist. Analyze data to identify key selling points and ideal buyer profiles."
Output Format Instruction: "Analyze the combined data. Identify: 1. Key selling points (property & neighborhood). 2. Potential target buyer profiles. 3. Potential marketing angles/themes. Output as a Markdown report with clear headings."`, 
      model: 'gpt-4o', // Using 4o as specified for strong reasoning
      temperature: 0.6,
      topP: 1.0,
      dataSource: { type: 'none' },
      additionalInput: `## Real Estate Market Analysis Report

### Key Selling Points

**Property:**
*   Spacious 4 bed / 3 bath layout (2,500 sqft) ideal for families.
*   Relatively modern build (1995) likely requiring fewer immediate updates.
*   Generous lot size (8,750 sqft) offering outdoor space.

**Neighborhood:**
*   Strong median household income ($85,000) indicates area affluence.
*   High percentage of residents with Bachelor's degrees+ (45%) suggests a professional community.
*   Predominantly owner-occupied (65%), indicating neighborhood stability.
*   Good average household size (2.6) aligns with family appeal.

### Potential Target Buyer Profiles

1.  **Established Families:** Seeking space, good neighborhood indicators (income, education), and outdoor areas. Value stability (owner-occupied rate).
2.  **Move-Up Professionals/Couples:** Attracted by the professional demographic (education level), neighborhood stability, and potentially planning for a family.
3.  **Relocators:** Drawn to the strong socio-economic profile of the area.

### Potential Marketing Angles/Themes

*   **"Space to Grow in a Thriving Neighborhood":** Focus on family appeal, combining house size, lot size, and positive demographic data.
*   **"Your Professional Hub":** Target professionals by highlighting the high education levels and income in the area, plus the solid home features.
*   **"Stable Investment, Beautiful Home":** Emphasize the high owner-occupancy rate and solid property features as indicators of a sound investment.`
    }
  }
};

// Node 5: Blog Post Generator
const blogPostNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 950, y: 300 }, // Below Analyzer
  data: {
    label: 'BlogPostGenerator',
    content: 'Write an engaging blog post about the property.',
    metadata: {
      inputs: ['DataConsolidator Output'], 
      context: `Tool/Action: None (creative writing).
LLM Task: Generate marketing copy based on data.
System Message: "You are a creative real estate copywriter specializing in engaging blog posts. Write in a warm, inviting, and informative style."
Output Format Instruction: "Write a 400-500 word blog post showcasing this property, weaving in key details from the provided data about the house and neighborhood lifestyle. Include a catchy title. Target audience: potential homebuyers."`, 
      model: 'gpt-4o',
      temperature: 0.8,
      topP: 1.0,
      dataSource: { type: 'none' },
      additionalInput: `# Find Your Forever Home: Space, Style, and Stability Await!

Imagine waking up in a home that perfectly blends comfort, space, and connection to a vibrant community. Welcome to [Property Address - Placeholder], a stunning 4-bedroom, 3-bathroom Single Family residence offering an incredible lifestyle opportunity.

Step inside this beautifully maintained 2,500 sqft home, built in 1995, and feel the immediate sense of space. With four generously sized bedrooms, there's room for everyone – whether you need dedicated home offices, playrooms for the kids, or quiet retreats. The three full bathrooms ensure busy mornings run smoothly.

But the appeal extends far beyond the front door. Situated on a spacious 8,750 sqft lot, you'll have plenty of room for backyard barbecues, gardening projects, or simply relaxing under the open sky. It's the perfect canvas for creating lasting memories.

This isn't just a house; it's a home nestled within a thriving neighborhood. The area boasts impressive demographics that speak volumes about its quality of life. With a median household income of $85,000 and 45% of residents holding a Bachelor's degree or higher, you'll be joining a community of driven and successful individuals. 

The stability of the neighborhood is reflected in its high owner-occupancy rate of 65%, creating a welcoming atmosphere where neighbors often become friends. The average household size of 2.6 hints at a family-friendly environment, perfect for putting down roots.

From its spacious interiors and ample outdoor space to its location within a stable and affluent community, this property truly offers the best of both worlds. It's more than just a house; it's the key to unlocking the lifestyle you've been dreaming of.

Ready to learn more? Contact us today for a private showing and discover why this could be your perfect forever home!`
    }
  }
};

// Node 6: Facebook Post Generator
const facebookPostNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 950, y: 500 }, // Below Blog Post
  data: {
    label: 'FacebookPostGenerator',
    content: 'Create a short, punchy Facebook post.',
    metadata: {
      inputs: ['DataConsolidator Output'], 
      context: `Tool/Action: None.
LLM Task: Generate social media copy optimized for Facebook.
System Message: "You are a social media marketing expert specializing in real estate Facebook posts. Focus on short text, emojis, and visual appeal."
Output Format Instruction: "Draft a Facebook post (max 3 short paragraphs) highlighting the top 2-3 selling points. Include relevant emojis (🏡💰🌳) and suggest a photo type (e.g., '[Suggest: Photo of kitchen]'). End with a clear call to action."`, 
      model: 'gpt-4o',
      temperature: 0.7,
      topP: 1.0,
      dataSource: { type: 'none' },
      additionalInput: `🏡 Just Listed! Your Dream Family Home Awaits! ✨

Discover spacious living in this fantastic 4-bed, 3-bath home (2,500 sqft!) on a large lot (8,750 sqft). Perfect for growing families or anyone needing extra space! 🌳 Built in 1995 and beautifully maintained.

Located in a sought-after neighborhood known for its stability (65% owner-occupied!) and great community vibe. Strong local income ($85k median) and education levels reflect the area's quality! 💰

[Suggest: Photo of the home's exterior or backyard]

Ready to see it for yourself? DM us for details or to schedule a private tour! #NewListing #DreamHome #RealEstate #[CityPlaceholder]`
    }
  }
};

// Node 7: Tweet Generator
const tweetNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 950, y: 700 }, // Below Facebook Post
  data: {
    label: 'TweetGenerator',
    content: 'Create a short Twitter thread.',
    metadata: {
      inputs: ['DataConsolidator Output'], 
      context: `Tool/Action: None.
LLM Task: Generate concise tweets with hashtags.
System Message: "You are a Twitter marketing expert specializing in real estate. Write concise, engaging tweets using relevant hashtags."
Output Format Instruction: "Draft a Twitter thread (2-3 tweets max). Tweet 1: Hook with main appeal & area. Tweet 2: Highlight other key details/perks. Tweet 3 (Optional): Call to action. Use #RealEstate #[City]."`, 
      model: 'gpt-4o',
      temperature: 0.7,
      topP: 1.0,
      dataSource: { type: 'none' },
      additionalInput: `1/3: 🏡 JUST LISTED in #[CityPlaceholder]! Spacious 4 bed/3 bath (2500 sqft) family home on a HUGE 8750 sqft lot. Perfect blend of space & location in a stable, sought-after neighborhood! #RealEstate #HomeForSale

2/3: Built 1995, great condition! Area boasts $85k median income & 45% w/ Bachelor's+. High owner-occupancy (65%) means great community feel. 🌳💰 #PropertyDetails #[CityPlaceholder]RealEstate

3/3: Don't miss out on this gem! ✨ Ideal for families or professionals seeking quality living. Tap the link in bio or DM for a viewing! #DreamHome #[CityPlaceholder]Homes`
    }
  }
};

// Define initial edges connecting the nodes
const initialEdges: WorkflowEdge[] = [
  {
    id: uuidv4(),
    source: propertyExtractorNode.id,
    target: dataConsolidatorNode.id,
    animated: true
  },
  {
    id: uuidv4(),
    source: demographicsExtractorNode.id,
    target: dataConsolidatorNode.id,
    animated: true
  },
  // Edges from Consolidator to Level 2 nodes
  {
    id: uuidv4(),
    source: dataConsolidatorNode.id,
    target: marketAnalyzerNode.id,
    animated: true
  },
  {
    id: uuidv4(),
    source: dataConsolidatorNode.id,
    target: blogPostNode.id,
    animated: true
  },
  {
    id: uuidv4(),
    source: dataConsolidatorNode.id,
    target: facebookPostNode.id,
    animated: true
  },
  {
    id: uuidv4(),
    source: dataConsolidatorNode.id,
    target: tweetNode.id,
    animated: true
  }
];

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [
    propertyExtractorNode, 
    demographicsExtractorNode, 
    dataConsolidatorNode,
    marketAnalyzerNode, // Add node 4
    blogPostNode,       // Add node 5
    facebookPostNode,   // Add node 6
    tweetNode           // Add node 7
  ], 
  edges: initialEdges, 
  
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
    
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })),
    
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),
    
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),
    
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),
    
  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),
})); 