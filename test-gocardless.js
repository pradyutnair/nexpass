// Test GoCardless integration
const { listInstitutions } = require('./src/lib/gocardless');

async function testGoCardlessIntegration() {
  console.log('🧪 Testing GoCardless Integration...\n');

  try {
    console.log('1. Testing environment variables...');
    const requiredEnvVars = ['GOCARDLESS_SECRET_ID', 'GOCARDLESS_SECRET_KEY'];
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing);
      return;
    }
    console.log('✅ Environment variables found');

    console.log('\n2. Testing token acquisition...');
    // This will test the token flow internally
    const institutions = await listInstitutions('GB');
    
    if (institutions && institutions.length > 0) {
      console.log('✅ Token acquisition successful');
      console.log(`✅ Fetched ${institutions.length} UK institutions`);
      console.log(`   Sample institution: ${institutions[0].name}`);
    } else {
      console.log('⚠️  No institutions returned');
    }

    console.log('\n3. Testing different countries...');
    const countries = ['DE', 'FR', 'ES'];
    for (const country of countries) {
      try {
        const countryInstitutions = await listInstitutions(country);
        console.log(`✅ ${country}: ${countryInstitutions.length} institutions`);
      } catch (error) {
        console.log(`❌ ${country}: ${error.message}`);
      }
    }

    console.log('\n🎉 GoCardless integration test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ GoCardless integration test failed:');
    console.error('Error:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

testGoCardlessIntegration();
