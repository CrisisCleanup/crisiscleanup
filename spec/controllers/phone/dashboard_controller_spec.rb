require 'rails_helper'

RSpec.describe Phone::DashboardController, :type => :controller do

	describe "Get #index" do
		before do |example|
		  org = FactoryGirl.create :legacy_organization
		  @user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false) 
		end	
		
		context "with a current_user" do
			it "renders the done view because no phone_outbound records exist" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :done
			end
		end
		
		context "with PhoneOutbound records" do
			before do |example|
				@phone_outbound = PhoneOutbound.create()
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :index		
			end
		end
	end
		
		
	describe "State filters" do
		
		context "Test State Filter - nil" do
			before do |example|
				org = FactoryGirl.create(:legacy_organization)
				@user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false)
				@phone_outbound = PhoneOutbound.create()
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :index		
			end
		end	
		
		context "Test State Filter - None" do
			before do |example|
				org = FactoryGirl.create(:legacy_organization, call_state_filter: 'None')
				@user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false)
				@phone_outbound = PhoneOutbound.create()
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :index		
			end
		end	
		
		context "Test State Filter - Empty String" do
			before do |example|
				org = FactoryGirl.create(:legacy_organization, call_state_filter: '')
				@user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false)
				@phone_outbound = PhoneOutbound.create()
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :done		
			end
		end		
		
		context "Test State Filter - With specific state - no more available" do
			before do |example|
				org = FactoryGirl.create(:legacy_organization, call_state_filter: 'Oklahoma')
				@user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false)
				@phone_outbound = PhoneOutbound.create()
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :done		
			end
		end	
		
		context "Verify PhoneAreaCode count" do
			fixtures :phone_area_codes
			
			it "has the correct count" do
				expect(PhoneAreaCode.count(:all)).to be > 300
			end
			
		end
		
		context "Test State Filter - With specific state - returns record that is associated with state" do
			fixtures :phone_area_codes
			
			before do |example|
				org = FactoryGirl.create(:legacy_organization, call_state_filter: 'Oklahoma')
				@user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false)
				@phone_outbound = FactoryGirl.create(:phone_outbound_1)
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :index		
			end
		end	
		
		context "Test State Filter - With specific state - dnis2 - returns record that is associated with state" do
			fixtures :phone_area_codes
			
			before do |example|
				org = FactoryGirl.create(:legacy_organization, call_state_filter: 'Oklahoma')
				@user = User.create(name:'Gary', email:'Gary@aol.com', password:'blue32blue32', legacy_organization_id: org.id, admin: false)
				@phone_outbound = FactoryGirl.create(:phone_outbound_2)
			end
			
			it "renders index view" do
				allow(controller).to receive(:current_user).and_return(@user)
				get :index
				expect(should).to render_template :index		
			end
		end	
		
	end

end